import JavaExecutor from '../containers/JavaExecutor';
import PythonExecutor from '../containers/PythonExecutor';
import CppExecutor from '../containers/CPPExecutor';
import CodeExecutorStrategy from '../types/CodeExecutorStrategy';
export default function createExecutor(
  codeLanguage: string
): CodeExecutorStrategy | null {
  if (codeLanguage.toLowerCase() === 'python') {
    return new PythonExecutor();
  } else if (codeLanguage.toLowerCase() === 'java') {
    return new JavaExecutor();
  } else if (codeLanguage.toLowerCase() === 'cpp') {
    console.log('Reached CPP');
    return new CppExecutor();
  } else {
    return null;
  }
}
