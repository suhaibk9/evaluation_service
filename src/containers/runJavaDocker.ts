import createContainer from './containerFactory';
import { JAVA_IMAGE } from '../utils/constants';
import { decodeDockerStream } from './dockerHelper';
const runJava = async (code: string, inputTestCase: string) => {
  const rawBuffer: Buffer[] = [];
  const runCommand = `echo '${code.replace(
    `'`,
    "'\\''"
  )}' > Main.java && javac Main.java && echo '${inputTestCase}' | java Main`;

  const javaDockerContainer = await createContainer(JAVA_IMAGE, [
    '/bin/sh',
    '-c',
    runCommand,
  ]);
  await javaDockerContainer.start();
    console.log('Java container started');
  const loggerStream = await javaDockerContainer.logs({
    timestamps: false,
    follow: true,
    stdout: true,
    stderr: true,
  });
  loggerStream.on('data', (chunk) => {
    rawBuffer.push(chunk);
  });
  //Done with the stream now remove the container.
  await new Promise((resolve) => {
    loggerStream.on('end', () => {
        console.log('Java code execution completed');
      const completeBuffer = Buffer.concat(rawBuffer);
      const decodedString = decodeDockerStream(completeBuffer);
      console.log(decodedString);
      resolve(decodedString);
    });
  });
  await javaDockerContainer.remove();
  return javaDockerContainer;
};
export default runJava;
