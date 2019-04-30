# Invertebrae

This game was created for [Ludum Dare 44](https://ldjam.com/events/ludum-dare/44/invertebrae).

If you’re here from Ludum Dare, you might be looking for the [story file](src/story.json). 

## Technologies

- typescript
- react (hooks-style)
- react-dnd

## Setup

To build and run from source:

1. Clone the repository locally. 
2. `npm install`
3. `npm start`

Now you can edit the code and the game will refresh in your browser. The vast majority of the story is within `src/story.json`, 
so if you wish to add more pages and puzzles, or change existing ones, that should be the only file you need to edit. 

If you want to change the initial words given, you can change them in `src/containers/Wordbank.tsx`. 

## Credits

Game font was Mister Pixel, provided by http://www.velvetyne.fr/fonts/mr-pixel/, under the SIL Open Font License.
