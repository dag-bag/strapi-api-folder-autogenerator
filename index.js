const fs = require("fs");
const path = require("path");

// Function to create a folder and its subfolders recursively
function createFoldersRecursively(basePath, folders, mainFolderName) {
  if (folders.length === 0) {
    return; // Stop recursion when there are no more folders to create
  }

  const folderToCreate = folders.shift(); // Get the next folder to create
  const folderPath = path.join(basePath, folderToCreate);

  fs.mkdir(folderPath, (err) => {
    if (err) {
      console.error(`Error creating folder: ${folderPath}`);
    } else {
      console.log(`Folder created: ${folderPath}`);
      // Determine the code content based on the folder name
      let fileContent = "";
      if (folderToCreate === "controllers") {
        // Controller code
        fileContent = `'use strict';

/**
 * ${mainFolderName} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${mainFolderName}.${mainFolderName}');`;
      } else if (folderToCreate === "routes") {
        // Router code
        fileContent = `'use strict';

/**
 * ${mainFolderName} router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::${mainFolderName}.${mainFolderName}');`;
      } else if (folderToCreate === "services") {
        // Service code
        fileContent = `'use strict';

/**
 * ${mainFolderName} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${mainFolderName}.${mainFolderName}');`;
      }

      // Create the file in the current folder with the name of the main folder
      const subfolderFilePath = path.join(folderPath, `${mainFolderName}.js`);

      fs.writeFile(subfolderFilePath, fileContent, (err) => {
        if (err) {
          console.error(`Error creating file: ${subfolderFilePath}`);
        } else {
          console.log(`File created: ${subfolderFilePath}`);
          // Continue creating subfolders recursively
          createFoldersRecursively(basePath, folders, mainFolderName);
        }
      });
    }
  });
}

// Function to create folders for multiple main folder names
function createFoldersForMainFolders(mainFolderNames) {
  mainFolderNames.forEach((mainFolderName) => {
    const mainFolder = mainFolderName; // Main folder name from the array
    const subfolders = ["controllers", "routes", "services"];
    const contentTypesFolder = path.join(
      mainFolder,
      "content-types",
      mainFolder
    );

    fs.mkdir(mainFolder, (err) => {
      if (err) {
        console.error(`Error creating main folder: ${mainFolder}`);
      } else {
        console.log(`Main folder created: ${mainFolder}`);
        // Create the content-types folder with the schema.json file
        fs.mkdir(contentTypesFolder, { recursive: true }, (err) => {
          if (err) {
            console.error(`Error creating folder: ${contentTypesFolder}`);
          } else {
            console.log(`Folder created: ${contentTypesFolder}`);
            // Create the schema.json file
            const schemaContent = {
              kind: "collectionType",
              collectionName: mainFolderName, // Use the main folder name
              info: {
                singularName: mainFolderName, // Use the main folder name
                pluralName: `${mainFolderName}s`, // Use the main folder name with an 's'
                displayName: mainFolderName, // Use the main folder name
                description: "",
              },
              options: {
                draftAndPublish: true,
              },
              pluginOptions: {},
              attributes: {
                title: {
                  type: "string",
                },
                approved: {
                  type: "boolean",
                },
              },
            };

            const schemaContentJSON = JSON.stringify(schemaContent, null, 2); // Pretty-print JSON
            const schemaFilePath = path.join(contentTypesFolder, "schema.json");

            fs.writeFile(schemaFilePath, schemaContentJSON, (err) => {
              if (err) {
                console.error(`Error creating file: ${schemaFilePath}`);
              } else {
                console.log(`File created: ${schemaFilePath}`);
                // Start creating subfolders and the files separately
                createFoldersRecursively(
                  mainFolder,
                  subfolders,
                  mainFolderName
                );
              }
            });
          }
        });
      }
    });
  });
}

// Pass an array of main folder names
const mainFolderNames = ["post_1", "post_2", "post_3"]; // Add your main folder names here
createFoldersForMainFolders(mainFolderNames);
