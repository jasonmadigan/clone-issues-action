const core = require('@actions/core');
const github = require('@actions/github');
const token = core.getInput('github_token');
const octokit = github.getOctokit(token);

const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');

const duplicateIssue = async (issue) => {
  let body = issue.body;

  if (typeof body === 'string' && body !== '') {
    body = body + `\n\Copied from: #${issue.number}`;
  } else {
    body = `Copied from: #${issue.number}`
  }

  let labels = issue.labels.map(label => label.name);

  const addLabel = core.getInput('addLabel');
  if (addLabel && addLabel !== '') {
    labels = [...labels, addLabel]; // update the existing 'labels' array
  }

  const newIssue = await octokit.rest.issues.create({
    owner: owner,
    repo: repo,
    title: issue.title,
    body: body,
    labels: labels
  });
  return [newIssue.id, newIssue.number].join(':');
};

async function run() {
  try {
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    const labelToCopy = core.getInput('labelToCopy');
    const labelToIgnore = core.getInput('labelToIgnore');
    
    const issues = await octokit.paginate('GET /repos/:owner/:repo/issues', { owner, repo, labels: labelToCopy, state: 'open' });
    const filteredIssues = issues.filter(issue => {
      return !issue.labels.some(label => label.name === labelToIgnore);
    });

    if (filteredIssues.length > 0) {
      for (const issue of filteredIssues) {
        await duplicateIssue(issue);
      }
    } else {
      console.log('No issues found with the specified label or all issues have the ignore label.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
