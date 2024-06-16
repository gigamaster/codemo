# Save File - util

[https://github.com/gigamaster/codemo](https://github.com/gigamaster/codemo)

## Description

Download a file or folder from github repository.

Use the API to download and generate a zip.

## Main features

- Get file from url
- Get zip from url
- Get zip from sub-directory url

## Usage

#### Get Zip from repo root/sub-directory/file url

	GitZip.zipRepo(pathToFolder[, callbackScope])

##### Example

	GitZip.zipRepo("https://github.com/gigamaster/codemo/blob/main/LICENSE.md");
	GitZip.zipRepo("https://github.com/gigamaster/codemo/main/README.md");
	GitZip.zipRepo("https://github.com/gigamaster/codemo/tree/main/src/template");
	GitZip.zipRepo("https://github.com/gigamaster/codemo/blob/main/src/template/head.html");
	GitZip.zipRepo("https://github.com/gigamaster/codemo/blob/main/src/template/head.html");
	...

##### Parameters

|Name|Type|Description|
|:---:|:---:|:---|
|pathToFolder|string|URL of Github repository.|
|callbackScope|object|Scope of the progressCallback function|

If the callback is registered, the code will be executed like this:    
 `yourcallback.apply(callbackScope, arguments)` 




#### Register progress callback

	GitZip.registerCallback(inputFn);
	
##### Parameters

|Name|Type|Description|
|:---:|:---:|:---|
|inputFn|function|callback is called when fetch files, zipping, error occur and so on.|

###### Progress Callback Parameters

|Name|Type|Description|
|:---:|:---:|:---|
|status|string|Indicates the status description like 'error', 'prepare', 'processing', 'done'.|
|message|string|The message of the above status.|
|percent|number|From 0 to 100, indicates the progress percentage. (debugging) |

## License

The MIT License (MIT)

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
