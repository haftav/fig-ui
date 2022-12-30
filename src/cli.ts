#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import invariant from 'tiny-invariant';

const DEFAULT_CONFIG_FILES = ['figui.config.js', 'figui.config.mjs'];

function findConfigPath() {
    let resolvedPath: string | undefined;

    for (const filename of DEFAULT_CONFIG_FILES) {
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
}

loadConfig();
