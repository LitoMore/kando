// SPDX-FileCopyrightText: Simon Schneegans <code@simonschneegans.de>
// SPDX-License-Identifier: CC0-1.0

import os from 'os';
import { DefinePlugin } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const plugins: any[] = [
  // We use this in order to know in the renderer process which operating system we are
  // running on.
  new DefinePlugin({
    // output from process.platform is the same as os.platform()
    cIsMac: process.platform === 'darwin',
    cIsWindows: process.platform === 'win32',
    cIsLinux: process.platform === 'linux',
  }),
];

// The macOS tray icons are loaded dynamically, so we copy them directly to the output
// directory.
if (os.platform() === 'darwin') {
  plugins.push(
    new CopyPlugin({
      patterns: [{ from: 'trayTemplate*.png', to: 'assets/', context: 'assets/icons/' }],
    })
  );
}

// Some resources are not bundled with webpack. We copy them to the output directory.
plugins.push(
  new CopyPlugin({
    patterns: [
      { from: 'icon-themes', to: 'assets/icon-themes', context: 'assets/' },
      { from: 'menu-themes', to: 'assets/menu-themes', context: 'assets/' },
      { from: 'sound-themes', to: 'assets/sound-themes', context: 'assets/' },
      { from: 'locales', to: '../main/locales' },
    ],
  })
);
