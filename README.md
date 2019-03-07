# PS PRs!

This is a small node utility to help us generate PR counts.

## Setup

0. Open up the terminal
1. If you don't have [homebrew]() installed, install it:
    * `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
2. If you don't have node installed, install it:
    * `brew install node`
3. If you don't have yarn installed, install it:
    *  `brew install yarn`
4. Clone this repo wherever you want it to live on your machine
    * `git clone https://github.com/paymentspring/ps-pr-count`
5. Switch into the directory you just cloned into
    * `cd ps-pr-count`
6. Install needed packages
    * `yarn install`


## Usage

This project requires a github token with the `repo` scope. Generate one
[here](https://github.com/settings/tokens).

Once you have your token, supply it to the `pr_counts` script with the `-k`
flag:

`node pr_counts.js -k "YOUR_TOKEN_HERE"`

ex:

`node pr_counts.js -k "0430f05e21db37457cf98ea7ab98adc3e71efec9"`