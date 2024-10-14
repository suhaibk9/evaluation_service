//Docker Container for running Python code
// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
const runPython = async (code: string) => {
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    'python3',
    '-c',
    code,
    'stty -echo',
  ]);
  await pythonDockerContainer.start();
  console.log('Python container started');
  const loggerStream = await pythonDockerContainer.logs({
    timestamps: false,
    follow: true,
    stdout: true,
    stderr: true,
  });
  loggerStream.on('data', (data) => {
    console.log(data.toString());
  });
  return pythonDockerContainer;
};
export default runPython;
