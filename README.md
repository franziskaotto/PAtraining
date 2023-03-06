My own gallery
==============

This is a PA practice project. It is similar to the Product list project on Journey.

Basic tasks
-----------

These tasks are not PA tasks but rather preparatory tasks that help you pratice your javascript and dom manipulation skills. However the PA practice tasks require that you implement these tasks.

Tasks
 * Write code that inserts HTML elements or code that displays information about each art piece in the `artObjects` array.

 * Each `artObject` contains a list of images (check the `images` key) and media (check the `media` key) about the art piece. Extend your code so that the images and a list of media items is diplayed on the page.

PA practice tasks
-----------------

First phase of the PA (~10min):
1. Explain your code to yourself, your pet, a friend, a student, really anybody.
2. Refactor your code such that all the code is contained in functions. Add a function `initializeUi()` that displays all the art objects on the page. The only code outside of functions is a call to this function (i.e. `initilaizeUi`). The art objects should be passed as a parameter to the `initializeUi` function.

In the next phase of the PA you get two tasks, one task that filters the art objects and one that finds one. In total you have 30min for both tasks. We choose the the tasks from a pool of possible tasks. Next you find a list of tasks that are similar to the actual PA tasks.

Write a function that filters all the art objects that have
* more than 2 media items of type audio,
* more than 2 media items of type video,
* both an media item of type audio and video,
* only media items of type audio,
* only media items of type video,
* a media item of type audio that is longer than 60s,
* media items of more than one language.

Write a function that finds one (the first) art object that has
* the longest single media item of type audio,
* the longest cummulative audio commentary (to calculate that add up all the durations of the media items of type audio),
* the most media items of type video,
* the most media items of type audio,
* the largest number of media items in different languages,
* only media items of one language.

The preciding two tasks conclude the main part of the PA. Now it is time to relax a bit. The next task will be a DO(O)M manipulation task. The will be similar to the following examples
* on the top of the page is a dropdown that shows all the art objects that were filtered previously. The user can select one of the art objects and it is shown on the page bellow the drop down.
* add a button to the top of page upon clicking the button the result of the find task is shown on the page

All the above tasks should use the `intializeUi` function to display the art objects.

Interesting trivia
------------------

The dataset of this project is based on the collection of the [National Gallery of Arts of United States](https://www.nga.gov/) as part of its [open data](https://github.com/NationalGalleryOfArt/opendata) program the National gallery provdes access to its data set. The [national-gallery-import](/national-gallery-import/) folder contains the script were used the generate the artObjects.js file from data set. Feel free to explore the code.