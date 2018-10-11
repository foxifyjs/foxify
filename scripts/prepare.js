#!/usr/bin/env node

const path = require('path')
const rimraf = require('rimraf')
const {
  spawn
} = require('child_process')
const fs = require('fs')
const readdir = require('fs-readdir-recursive')
const UglifyEs = require('uglify-es')

let startTime = new Date().getTime()

const outDir = path.join(__dirname, '..', 'framework')

rimraf.sync(outDir)

const tsc = spawn(path.join(__dirname, '..', 'node_modules', '.bin', 'tsc'))

tsc.stdout.on('data', (data) => console.log(`stdout: ${data}`))

tsc.stderr.on('data', (data) => console.log(`stderr: ${data}`))

tsc.on('close', (code) => {
  const fileNames = readdir(outDir, (filename) => /(?<!\.ts)$/.test(filename))

  fileNames.map((filename) => {
    let filePath = path.join(outDir, filename)

    let content = fs.readFileSync(filePath, 'utf8')

    content = UglifyEs.minify(content, {
      toplevel: true,
      output: {
        beautify: true,
        comments: true,
      },
    })

    if (content.error) throw new Error(content.error)

    fs.writeFileSync(filePath, content.code, 'utf8')
  })

  if (code === 0) console.log(`finished in ${new Date().getTime() - startTime}ms`)
  else console.error(`child process exited with code ${code}`)
})