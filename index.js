#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))


const projectNameRegex = new RegExp('\w|\d_|-', 'g')
let projectName = 'my-webreact-app'
let projectPath = ''

function handleFailure(message) {
  createSpinner(message).error()
  return process.exit(1)
}

async function getProjectName() {
  const answers = await inquirer.prompt({
    name: 'project_name',
    type: 'input',
    message: 'What is your project named?',
    default() {
      return projectName
    }
  })

  projectName = answers.project_name

  if (projectNameRegex.test(projectName)) {
    projectPath = path.resolve(projectName)
  } else {
    handleFailure('Invalid project name or path.')
  }
}

await getProjectName()

async function getProjectTemplate() {
  const answers = await inquirer.prompt({
    name: 'project_template',
    type: 'list',
    message: `Would you like to use ${chalk.blue('Typescript')} with this project?`,
    choices: [
      'Yes',
      'No'
    ]
  })

  return handleAnswer(answers.project_template)
}

await getProjectTemplate()


async function handleAnswer(answer) {
  const bootstrapMsg = `
  You're good to go, now run:

  cd ${projectName}
  npm install
  npm run dev
  `

  if (answer === 'Yes') {
    const spinner = createSpinner(`Creating project at ${projectPath}`).start()

    fs.mkdir(projectPath, (err) => {
      if (err) {
        console.log('Error: ', err)
      }
    })

    spinner.success()
    console.log(bootstrapMsg)

    return process.exit(0)
  } else {
    const spinner = createSpinner(`Creating project at ${projectPath}`).start()

    await sleep()

    spinner.success()
    console.log(bootstrapMsg)

    return process.exit(0)
  }
}
