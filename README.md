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

**Warning**: one large deficit of the engine is that it does not support more than one instance of any word. If you end up in a situation
where the player drags two of the same word into the word bank or the prompt, the game will behave unexpectedly and probably become unplayable. 

## Credits

Game font was Terminal Grotesque, provided by https://www.velvetyne.fr/fonts/terminal-grotesque/, under the SIL Open Font License.
