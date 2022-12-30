#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import invariant from 'tiny-invariant';

import { runMe } from './generator';

const POSSIBLE_CONFIG_FILES = ['figui.config.js', 'figui.config.mjs'];

// TODO: allow users to pass in through arg
const POSSIBLE_LIBRARY_LOCATIONS = ['ui', 'src/ui'];

// TODO: refactor following two functions into a single function
function findConfigPath() {
    let resolvedPath: string | undefined;

    for (const filename of POSSIBLE_CONFIG_FILES) {
        const filePath = path.resolve(process.cwd(), filename);

        if (!fs.existsSync(filePath)) {
            continue;
        }

        resolvedPath = filePath;
        break;
    }

    if (!resolvedPath) {
        invariant(!!resolvedPath, 'No config file found.');
    }

    return resolvedPath;
}

function getComponentLibraryLocation() {
    let foundLocation: string | undefined;
    for (const location of POSSIBLE_LIBRARY_LOCATIONS) {
        const filePath = path.resolve(process.cwd(), location);

        console.log(filePath);

        if (!fs.existsSync(filePath)) {
            continue;
        }

        foundLocation = filePath;
        break;
    }

    if (!foundLocation) {
        invariant(!!foundLocation, 'Unable to find a known location for the component library.');
    }

    return foundLocation;
}

interface Config {
    file: string;
    key: string;
}

function isObjectLike(x: unknown): x is { [key in PropertyKey]: unknown } {
    return x !== null && typeof x === 'object';
}

function assertIsConfig(x: unknown): x is Config {
    if (isObjectLike(x) && typeof x.file === 'string' && typeof x.key === 'string') {
        return true;
    }

    return false;
}

async function loadConfig() {
    console.log(`RUNNING COMMAND IN: ${process.cwd()}`);
    const configPath = findConfigPath();
    console.log(`FOUND CONFIG AT: ${configPath}`);

    const importedConfig = await import(configPath);

    const config = importedConfig.default;

    console.log(config);

    invariant(
        assertIsConfig(config),
        'Make sure your config file includes the required properties'
    );

    return config;
}

async function getDataFromFigma(config: Config) {}
function generateComponents(componentData: any) {}
function generateFiles(components: any) {}

async function run() {
    const { file, key } = await loadConfig();
    const libraryLocation = getComponentLibraryLocation();

    // [ButtonInstance, CardInstance, etc.]
    const componentData = await getDataFromFigma({
        file,
        key,
    });

    runMe(libraryLocation);

    const components = generateComponents(componentData);

    generateFiles(components);
}

run();
