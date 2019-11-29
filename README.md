# cacompilepas
A web application on which you can find every computer science course sheet you want &lt;3
Salut
Golven

It uses Docker, ReactJS and PHP

## Docker

#### The project can be launched with docker thanks to the following commands
Build containers
```
docker-compose build
```
Launch containers
```
docker-compose up -d
```
Stop containers
```
docker-compose down
```

#### To edit files or execute commands like sql queries in a container
```
docker exec -ti [container_id] bash
```
To find a container id
```
docker ps
```


## Git

#### Fork a project
Go on github project's page and click on "fork" in the top-right corner
Then clone project in a directory
```
git clone [your_new_github_fork_address]
```
Move to the project folder
```
cd cacompilepas
```
Tell git to follow the official remote repository
```
git remote add upstream [official_github_project_address]
```
Create a branch with the name of your pr
```
git checkout -b [your_pr_reference]
```
Example
```
git checkout -b CCP-45
```
That's it ! Now create, edit or delete files :clap:
When your feature is ready to be tested, you can make a PR (pull request) :wink:

Don't forget to check your git's state sometimes with
```
git status
```

#### Update local code with master
Fetch and merge data from your master
```
git pull origin master
```
If necessary, resolve conflicts

#### To make a PR, follow these steps
Add changes that you want to stage (file or directory addition, modification or deletion
```
git add [file_or_directory]
```
***or***
To see all modifications you did to those files (recommended)
  Press 'y' to accept, 'n' to deny
```
git add -p
```
***or***
**More risky**, add all files (make a git add -p before)
```
git add .
```
Sometimes you'll need to discard changes
Then you can make a
```
git checkout [file]
```
Stage your changes
```
git commit -m "[PR_reference] [PR_type]/[PR_epic]([PR_domain]): [pr_description]"
```
Example
```
git commit -m "CCP-45 feat/front(homepage): change background color and font size"
```
Push your changes on your branche's origin to submit a pull request
**/!\ Never push on master ! /!\**
_Your branch name should be the PR_reference_
```
git push origin [your_branch_name]
```
Then on GitHub

Go on the project's repository if everything went good, you should will see a yellow section appeared

Click on "Compare and pull request"

Read carefully your entire commit code and compare it to the pre-commit one

If you see errors or strange behaviors, make necessary modifications, a new commit and push one more time

If necessary, leave a comment with complementary information

In the top-right corner, add some reviewers

Assign yourself

Choose a representative label

Click on "Create pull request"

Check regularly reviewers' comments to see what you should or must correct or improve

