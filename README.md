# cacompilepas
A web application on which you can find every computer science course sheet you want &lt;3
Salut
Golven

It uses Docker, ReactJS and PHP

##Docker

####The project can be launched with docker thanks to the following commands
Build containers
`docker-compose build`
Launch containers
`docker-compose up -d`
Stop containers
`docker-compose down`

####To edit files or execute commands like sql queries in a container
`docker exec -ti [container_id] bash`
To find a container id
`docker ps`


##Git

####To fork a project
Go on github project's page and click on "fork" in the top-right corner
Then in a folder 
`git clone [your_new_github_fork_address]`
`cd littleboat`
`git remote add upstream [official_github_project_address]`
That's it ! Now create, edit or delete files :clap:
When your feature is ready to be tested, you can make a PR (pull request) :wink:

Don't forget to do
`git status`
sometimes, to check your git's state at a given moment

####To update local git with master
`git pull origin master`
If necessary, resolve conflicts

####To make a PR, follow these steps
`git add [modified_file]`
OR
`git add [added_file]`
OR
To see all modifications (recommended)
`git add -p`
OR
**More risky**, add all files
`git add .`
Stage changes
`git commit -m "[PR_reference] [PR_type]/[PR_epic]([PR_domain])`
**/!\ Never push on master ! /!\**
`git push origin [PR_reference]`

