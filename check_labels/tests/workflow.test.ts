import { MockGithub } from "@kie/mock-github";
import { Act } from "@kie/act-js";
import path from "path";

let mockGithub: MockGithub;

console.log(path.resolve(__dirname, "..", "requirements.txt"))

beforeEach(async () => {
  mockGithub = new MockGithub({
    repo: {
      "testDockerAction": {
        currentBranch: "main",
        files: [
          {
            src: path.join(__dirname, "workflow.yaml"),
            dest: ".github/workflows/test.yml",
          },
          {
            src: path.resolve(__dirname, "..", "action.yaml"),
            dest: "/action.yml",
          },
          {
            src: path.resolve(__dirname, "..", "Dockerfile"),
            dest: "/Dockerfile",
          },
          {
            src: path.resolve(__dirname, "..", "action.py"),
            dest: "/action.py",
          },
          {
            src: path.resolve(__dirname, "..", "..", "requirements.txt"),
            dest: "/requirements.txt",
          },
          {
            src: path.resolve(__dirname, "optiver.toml"),
            dest: "/optiver.toml",
          },
        ],
        owner: "optiflow"
      },
    },
  },);

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test("test workflow", async () => {
  const act = new Act(mockGithub.repo.getPath("testDockerAction"));
  console.log(mockGithub.repo.getPath("testDockerAction"))
  act.setEvent({
    pull_request: {
      head: {
        ref: "branch",
      },
      labels : [{
        color : "#000000",
        default: false,
        description: "some label",
        id: 1,
        name: "product:sandbox",
        node_id: "",
        url: ""
      }]
    },
  })
  // act
  const result = await act.setEnv("GITHUB_WORKSPACE", "/github/workspace").runEvent("pull_request", { logFile: process.env.ACT_LOG ? "docker.log" : undefined, });
  expect(result.length).toBe(2);
  expect(result).toMatchObject([
    {
      name: "Main ./testDockerAction",
      status: 0,
      output: "Hello Mona the Octocat",
    },
    {
      name: "Main Get the output time",
      status: 0,
      output: expect.stringMatching(/The time was .*/),
    }
  ]);
});