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

#### To fork a project
1 Go on github project's page and click on "fork" in the top-right corner
2 Then clone project somewhere
```
git clone [your_new_github_fork_address]
```
3 Move to the project folder
```
cd cacompilepas
```
4 Tell git to follow the official repository
```
git remote add upstream [official_github_project_address]
```
5 That's it ! Now create, edit or delete files :clap:
  When your feature is ready to be tested, you can make a PR (pull request) :wink:

Don't forget to make a
```
git status
```
sometimes, to check your git's state at a given moment

#### To update local code with master
6 Fetch and merge data from your master
```
git pull origin master
```
7 If necessary, resolve conflicts

#### To make a PR, follow these steps
8 Add changes that you want to stage (file or directory addition, modification or deletion)
```
git add [file_or_directory]
```
***or***
9 To see all modifications you did to those files (recommended)
  Press 'y' to accept, 'n' to deny
```
git add -p
```
***or***
**More risky**, add all files
```
git add .
```
Sometimes you'll need to discard changes
Then you can make a
```
git checkout [file]
```
10 Stage your changes
```
git commit -m "[PR_reference] [PR_type]/[PR_epic]([PR_domain])
```
11 Push your changes on your branche's origin to submit a pull request
   **/!\ Never push on master ! /!\**
   _Your branch name should be the PR_reference_
```
git push origin [your_branch_name]
```
12 Then on GitHub

13 Go on the project's repository if everything went good, you should will see a yellow section appeared

14 Click on "Compare and pull request"

15 Read carefully your entire commit code and compare it to the pre-commit one

16 If you see errors or strange behaviors, make necessary modifications and repeat steps 8 to 15

17 If necessary, leave a comment with supplementary information

18 In the top-right corner, add some reviewers

19 Assign yourself

20 Choose a representative label

21 Click on "Create pull request"

22 Check regularly reviewers' comments to see what you should or must correct or improve

