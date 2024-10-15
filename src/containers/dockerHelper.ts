import DockerStreamOutput from '../types/dockerStreamOutput';
import { DOCKER_STREAM_HEADER_SIZE } from '../utils/constants';
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
export { decodeDockerStream };
