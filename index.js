#!/usr/bin/env node

import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import { exec } from 'child_process'
import fs from 'fs'
import util from 'util'
const myExec = util.promisify(exec)

const projectNameRegex = new RegExp('\w|\d_|-')
const repository = 'https://github.com/mateusabelli/create-webreact-app.git'
let projectName = 'my-webreact-app'
let projectPath = ''

function handleFailure(message) {
  const spinner = createSpinner(message)
  spinner.error()
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

async function handleAnswer(isTypescript) {
  const bootstrapMsg = `
  You're good to go, now run:

  cd ${projectName}
  npm install
  npm run dev
  `

  if (isTypescript === 'Yes') {
    const spinner = createSpinner(`Creating project at ${projectPath}`).start()

    await myExec(`git clone --branch react-ts ${repository} ${projectName}`, async (error) => {
      if (error) {
        handleFailure(`error: ${error.message}`)
      }

      await fs.promises.rm(`${projectPath}/.git`, { recursive: true, force: true })

      spinner.success()
      console.log(bootstrapMsg)

      return process.exit(0)
    })

  } else {
    const spinner = createSpinner(`Creating project at ${projectPath}`).start()

    await myExec(`git clone --branch react ${repository} ${projectName}`, async (error) => {
      if (error) {
        handleFailure(`error: ${error.message}`)
      }

      await fs.promises.rm(`${projectPath}/.git`, { recursive: true, force: true })

      spinner.success()
      console.log(bootstrapMsg)

      return process.exit(0)
    })
  }
}