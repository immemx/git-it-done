// variables
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // assigning the query string to a var
    var queryString = document.location.search;

    // Break the search into an array and grabbing the latter (name of repo) into a var
    var repoName = queryString.split("=")[1];
    
    // pass the now captured repo name into function call
    if (repoName) {
        // assign repo name to top of page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // if no repo is given default back to main page.
        document.location.replace("./index.html")
    }
};

var getRepoIssues = function(repo) {
    // define url
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    fetch(apiUrl)
    .then(function(response) {

        if (response.ok) {
            response.json()
            .then(function(data) {
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("link")) {
                    displayWarning(repo)
                }
            });
        } else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    })
};

var displayIssues = function(issues) {
    // check to make sure issue list isnt empty
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    // for loop
    for (var i = 0; i < issues.length; i++) {
        // create a linke element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = '(Issue)';
        }

        // append to container 
        issueEl.appendChild(typeEl);

        // append to page
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName()

