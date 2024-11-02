import Docker from 'dockerode';
const createContainer = async (imageName: string, cmdExecutable: string[]) => {
  const docker = new Docker();

  const container = await docker.createContainer({
    Image: imageName, // image to use
    Cmd: cmdExecutable, // command to run in the container
    AttachStdin: true, // to enable input stream
    AttachStdout: true, // to enable output stream
    AttachStderr: true, // to enable error stream
    OpenStdin: true, // to keep stdin open even if not attached i.e. to keep input stream open even if not attached
    HostConfig: {
      // 1024 * 1024 * 1024, // 1GB
      Memory: 1024 * 1024 * 1024, // 1GB
    },
  });
  return container;
};
export default createContainer;
