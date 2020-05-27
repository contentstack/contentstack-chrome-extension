# Contentstack-edit-button
Chrome extension to add an Edit button to the front end of a Contentstack website

## HTML  data-*  Attributes For Setup
We need to add the two attributes for edit button to function.
 1. data-pageref - Used to detect the UID of the entry used for current page.
 2. data-contenttype - Used to detect the Content Type of entry current page.
 3. data-local - Used to detect the local of entry for current page

    <body data-pageref="bltb8b487559a1b715d" data-contenttype="product" data-local="en-us">

## Chrome Extension Set Up
To install the Chrome Extension you need to enable developer mode. Learn more here:
https://www.mstoic.com/enable-developer-mode-in-chrome/


## Extension Options
The following fields need to be set up in the chrome extension:

- Stack settings:
    - You stacks API key : blt123456789852dec
- Domain settings
    - Enter your host names separated by ,: stage.domain.com, domain.com, localhost:4000
    
