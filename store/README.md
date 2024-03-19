should be able to set up list of items to sell

should have visual interface for selling items, in channel for example

user should be able to buy item 

which should open a trade bts

and transfer gp and items bts

awesome sauce, and you have to dig into code to edit stuff

steps: 

go to api.slack.com and create new app

create env and put the following values in it:

* signing secret: basic info
* bot token: go to oauth and permissions and add scopes, then install to workspace to get bot token
* app token: basic information > generate app level token

create app in slack by running /app and then grabbing app id and key and putting them in .env

enable events and add event scope

add local ngrok link

configure interactivity and shortcuts

deploy with nest!