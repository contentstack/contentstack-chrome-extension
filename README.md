# Contentstack Chrome Extension



The ‘Contentstack’ Chrome extension helps you quickly navigate from a live web page to its corresponding entry in Contentstack. 

If you are on a web page of a site that is powered by Contentstack, and if you have the permission to edit its content, you will see an edit button at the right/left bottom of the page. Clicking this button will take you to the corresponding entry in Contenstack, where you can edit the entry.

# How to set up the extension?
1. Visit the [Chrome Web Store Extension](https://chrome.google.com/webstore/category/extensions) page and search for **contentstack-chrome-extension**.
2. Once installed, a pop-up will prompt you to enter the stack details and button preferences. Provide the necessary details in each field (all fields are mandatory) and then save the configuration.
3. Add the following attributes to the body tag of your website templates or pages:
         - **data-pageref**: Used to identify the entry UID of the current page  
         - **Data-contenttype**: Used to identify the content type UID of the entry  
         - **data-locale**: Used to identify the locale of the entry for the current page  

         Here’s an example of how to add these details in your code:

         <body data-pageref="bltb8b487559a1b715d" data-contenttype="product" data-locale="en-us">

         In the above example, "bltb8b487559a1b715d" is the UID of the entry and "product" is the UID of the content type, and "en-us" is the locale of the entry of the corresponding web page.  
4. Go to the tab in your Chrome browser where you want to use this extension, and reload or refresh the page.  
**Note**: This is a one-time activity when you add a new domain or an API key.
6.   The **Edit** button will now be visible on your Contentstack-powered web pages.
7.   Click on this button and you will be redirected to its corresponding entry page.

  This project is inspired from the work originally created by SSE (https://github.com/FergusKing/contentstack-edit-button). We want to acknowledge and thank them for inspiring us to create Contentstack Chrome Extension.