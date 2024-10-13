import { Request, Response } from 'express';
const pingController = (_req: Request, res: Response) => {
  return res.send('Server is Alive');
};
export default pingController;

