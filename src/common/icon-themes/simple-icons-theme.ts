//////////////////////////////////////////////////////////////////////////////////////////
//   _  _ ____ _  _ ___  ____                                                           //
//   |_/  |__| |\ | |  \ |  |    This file belongs to Kando, the cross-platform         //
//   | \_ |  | | \| |__/ |__|    pie menu. Read more on github.com/menu/kando           //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////

// SPDX-FileCopyrightText: Simon Schneegans <code@simonschneegans.de>
// SPDX-License-Identifier: MIT

import { matchSorter } from 'match-sorter';
import * as simpleIcons from 'simple-icons';

import { IIconTheme } from './icon-theme-registry';

/** This class implements an icon theme that uses the Simple Icons font as icons. */
export class SimpleIconsTheme implements IIconTheme {
  protected iconsMap: Map<string, simpleIcons.SimpleIcon>;

  /** This array contains all available icon names. It is initialized in the constructor. */
  protected iconNames: Array<string> = [];

  /** The replacement map for special characters in the title. */
  protected titleToSlugReplacements: Record<string, string>;

  /** The regex used to match special characters in the title. */
  protected titleToSlugCharsRegex: RegExp;

  constructor() {
    this.iconsMap = new Map(
      Object.entries(simpleIcons).map(([key, value]) => [
        key.slice(2).toLowerCase(),
        value,
      ])
    );

    this.iconNames = Array.from(this.iconsMap.keys());
  }

  /** Returns a human-readable name of the icon theme. */
  get name() {
    return 'Simple Icons';
  }

  get icons() {
    return this.iconsMap;
  }

  /**
   * Creates a div element that contains the icon with the given name.
   *
   * @param icon One of the icons returned by `listIcons`.
   * @returns A div element that contains the icon.
   */
  createIcon(slug: string) {
    const icon = this.iconsMap.get(slug);

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('icon-container');

    const iconMask = document.createElement('div');
    iconMask.classList.add('icon-mask');

    // [NOTE] The icon color can be changed from there. We can also use CSS to overwrite it.
    iconMask.style.backgroundColor = '#' + icon.hex;

    // [NOTE] We can consider using file URLs instead of data URLs to improve performance.
    iconMask.style.maskImage = `url(data:image/svg+xml;base64,${btoa(icon.svg)})`;

    console.log('test', slug);

    containerDiv.appendChild(iconMask);

    return containerDiv;
  }

  /** Returns information about the icon picker for this icon theme. */
  get iconPickerInfo() {
    return {
      type: 'list' as const,
      usesTextColor: true,
      listIcons: (searchTerm: string) => {
        return matchSorter(
          this.iconNames,

          // Replace special characters in the search term with their replacements.
          // This is necessary because the icon names from the CSS file are always slugs.
          searchTerm.replace(
            this.titleToSlugCharsRegex,
            (char) => this.titleToSlugReplacements[char]
          )
        );
      },
    };
  }
}
