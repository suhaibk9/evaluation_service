import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';

import SubmissionWorker from './workers/submissionWorker';
import router from './config/bullBoardConfig';
// import sampleQueueProducer from './producers/sampleQueueProducer';
import serverConfig from './config/serverConfig';
// import sampleWorker from './workers/sampleWorker';
import apiRouter from './routes/index';
// import runPython from './containers/runPythonDocker';
// import runJava from './containers/runJavaDocker';
// import runCpp from './containers/runCPPDocker';
import submissionQueueProducer from './producers/submissionQueueProducer';
const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/queue/ui', router);
app.use('/api', apiRouter);
app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);

  //   sampleQueueProducer(
  //     'SampleJob',
  //     {
  //       name: 'Jane Doe',
  //       compnay: 'Doe Inc',
  //       postion: 'Software Engineer',
  //       location: 'Lagos, Nigeria',
  //     },
  //     2
  //   );
  //   sampleWorker('sampleQueue');
  //   const code = `
  // # Simple greeting loop
  // n = int(input("How many times do you want to be greeted? "))
  // for i in range(n):
  //     print("Hello, World!", i)
  // `;

  //   runPython(code, '10');

  //   const code = `
  // import java.util.Scanner;

  // public class Main {
  //     public static void main(String[] args) {
  //         // Create a scanner object to read input
  //         Scanner scanner = new Scanner(System.in);

  // for(int i=0;i<5;i++){
  // System.out.println("Hello, World! "+i);
  // }
  //         scanner.close();
  //     }
  // }
  // `;

  //   runJava(code, '');
  const code = `#include <iostream>

int main() {
    // Loop to print "Hello, World!" 5 times
    int n;std::cin>>n;
    for (int i = 0; i < n; i++) {
        std::cout << i << std::endl;
    }

    return 0;
}
`;
  submissionQueueProducer(
    'SubmissionJob',
    {
      language: 'cpp',
      code,
      inputCase: '10',
    },
    100
  );
  SubmissionWorker('submissionQueue');
  
});
