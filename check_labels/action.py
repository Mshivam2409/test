from github import Github
import github_action_utils as gha_utils  # type: ignore

gh = Github(gha_utils.get_env("GITHUB_TOKEN"))
ctx = gha_utils.event_payload()
import os

from pathlib import Path
print((Path(os.environ["GITHUB_WORKSPACE"]) /  "optiver.toml").read_text())
gha_utils.notice(ctx["pull_request"]["labels"])