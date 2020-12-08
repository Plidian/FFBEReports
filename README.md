# FFBEReports
 
I started this project as a means to help me analyze the data for the game FFBE.  I wanted a way to take the JSON files exported from the FFBESync tool, and analyze them.
My background was in SQL server reporting so I set myself the task of figuring out how to process the JSON into MS SQL so I could write SQL queries against that data.
The tool has 3 basic functions at this poing in time (12/8/2020)

1) When initiated the application goes to Git hub repository for the static data that aEnigma provides.  By connecting to the github API it retrieves a list of all the files in the repository and their hash.  It then compares that hash to a copy stored locally.  If the file is new it downloads a fresh copy and then iterates through each file and takes the JSON and "flattens" it.  Since I was most familiar with SQL the first step I needed, was to turn the nested JSON data into something I could work with.
2) Creates a web-page for users to pass their data to the application.
3) Takes the JSON files and flattens them, and merges them with the static data.  Then format those files and provide them to the end user.  Also upload them to a MSSQL Database to allow for reporting.

This tool uses EJS as a renderer for the web pages, Express as the web server and a few others for data manipulation.
