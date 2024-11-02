import DockerStreamOutput from '../types/dockerStreamOutput';
import { DOCKER_STREAM_HEADER_SIZE } from '../utils/constants';
import { ExecutionResponse } from '../types/CodeExecutorStrategy';
const decodeDockerStream = (buffer: Buffer): DockerStreamOutput => {
  //Offset to keep track of the current position in the buffer
  let offset = 0;
  //Output object to store the decoded output
  const output: DockerStreamOutput = {
    stdout: '',
    stderr: '',
  };
  while (offset < buffer.length) {
    //First 4 bytes contain the type of stream
    const typeOfStream = buffer[offset];
    //chunkLength is the length of the actual data in the chunk so we jump 4 bytes to get the length
    const chunkLength = buffer.readUInt32BE(offset + 4);
    //Jump 8 bytes to get the actual data
    offset += DOCKER_STREAM_HEADER_SIZE;
    if (typeOfStream === 1) {
      //stdOut
      output.stdout += buffer.toString('utf-8', offset, offset + chunkLength);
    } else if (typeOfStream == 2) {
      //stdErr
      output.stderr += buffer.toString('utf-8', offset, offset + chunkLength);
    }
    //Increment the offset to move to the next chunk
    offset += chunkLength;
  }
  return output;
};

function fetchDecodedStream(
  loggerStream: NodeJS.ReadableStream,
  rawBuffer: Buffer[]
): Promise<ExecutionResponse> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject({ output: 'Time limit exceeded', status: 'TLE' });
    }, 3000);
    loggerStream.on('end', () => {
      clearTimeout(timeout);
      const completeBuffer = Buffer.concat(rawBuffer);
      const decodedString = decodeDockerStream(completeBuffer);
      console.log(decodedString.stdout);
      if (decodedString.stderr) {
        reject({ output: decodedString.stderr, status: 'error' });
      } else {
        resolve({ output: decodedString.stdout, status: 'success' });
      }
    });
  });
}
export { decodeDockerStream, fetchDecodedStream };
