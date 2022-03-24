const audioPathDefaultStartPart1 = 'https://github.com/rolling-scopes-school/';
const audioPathDefaultStartPart2 = 'tasks/blob/master/tasks/rslang/english-for.kids.data/';
const audioPathDefaultStart = audioPathDefaultStartPart1 + audioPathDefaultStartPart2;
const audioPathDefaultEnd = '?raw=true';
const imagePathDefaultPart1 = 'https://raw.githubusercontent.com/rolling-scopes-school/';
const imagePathDefaultPart2 = 'tasks/master/tasks/rslang/english-for.kids.data/';
const imagePathDefault = imagePathDefaultPart1 + imagePathDefaultPart2;

const audioPathExtended = 'https://wooordhunt.ru//data/sound/sow/us/';
const imagePathExtended = './assets/';

const cardsBase = {
  Categories: [
    {
      name: 'Action (set A)',
      imageSrc: `${imagePathDefault}img/cry.jpg`,
      cards: [
        {
          word: 'cry',
          translation: 'плакать',
          imageSrc: `${imagePathDefault}img/cry.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/cry.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'dance',
          translation: 'танцевать',
          imageSrc: `${imagePathDefault}img/dance.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/dance.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'dive',
          translation: 'нырять',
          imageSrc: `${imagePathDefault}img/dive.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/dive.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'draw',
          translation: 'рисовать',
          imageSrc: `${imagePathDefault}img/draw.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/draw.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'fish',
          translation: 'ловить рыбу',
          imageSrc: `${imagePathDefault}img/fish.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/fish.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'fly',
          translation: 'летать',
          imageSrc: `${imagePathDefault}img/fly.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/fly.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'hug',
          translation: 'обнимать',
          imageSrc: `${imagePathDefault}img/hug.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/hug.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'jump',
          translation: 'прыгать',
          imageSrc: `${imagePathDefault}img/jump.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/jump.mp3${audioPathDefaultEnd}`,
        },
      ],
    },
    {
      name: 'Action (set B)',
      imageSrc: `${imagePathDefault}img/open.jpg`,
      cards: [
        {
          word: 'open',
          translation: 'открывать',
          imageSrc: `${imagePathDefault}img/open.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/open.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'play',
          translation: 'играть',
          imageSrc: `${imagePathDefault}img/play.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/play.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'point',
          translation: 'указывать',
          imageSrc: `${imagePathDefault}img/point.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/point.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'ride',
          translation: 'ездить',
          imageSrc: `${imagePathDefault}img/ride.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/ride.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'run',
          translation: 'бегать',
          imageSrc: `${imagePathDefault}img/run.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/run.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'sing',
          translation: 'петь',
          imageSrc: `${imagePathDefault}img/sing.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/sing.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'skip',
          translation: 'пропускать, прыгать',
          imageSrc: `${imagePathDefault}img/skip.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/skip.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'swim',
          translation: 'плавать',
          imageSrc: `${imagePathDefault}img/swim.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/swim.mp3${audioPathDefaultEnd}`,
        },
      ],
    },
    {
      name: 'Animal (set A)',
      imageSrc: `${imagePathDefault}img/cat.jpg`,
      cards: [
        {
          word: 'cat',
          translation: 'кот',
          imageSrc: `${imagePathDefault}img/cat.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/cat.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'chick',
          translation: 'цыплёнок',
          imageSrc: `${imagePathDefault}img/chick.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/chick.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'chicken',
          translation: 'курица',
          imageSrc: `${imagePathDefault}img/chicken.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/chicken.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'dog',
          translation: 'собака',
          imageSrc: `${imagePathDefault}img/dog.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/dog.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'horse',
          translation: 'лошадь',
          imageSrc: `${imagePathDefault}img/horse.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/horse.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'pig',
          translation: 'свинья',
          imageSrc: `${imagePathDefault}img/pig.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/pig.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'rabbit',
          translation: 'кролик',
          imageSrc: `${imagePathDefault}img/rabbit.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/rabbit.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'sheep',
          translation: 'овца',
          imageSrc: `${imagePathDefault}img/sheep.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/sheep.mp3${audioPathDefaultEnd}`,
        },
      ],
    },
    {
      name: 'Animal (set B)',
      imageSrc: `${imagePathDefault}img/bird.jpg`,
      cards: [
        {
          word: 'bird',
          translation: 'птица',
          imageSrc: `${imagePathDefault}img/bird.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/bird.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'fish',
          translation: 'рыба',
          imageSrc: `${imagePathDefault}img/fish1.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/fish.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'frog',
          translation: 'жаба',
          imageSrc: `${imagePathDefault}img/frog.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/frog.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'giraffe',
          translation: 'жирафа',
          imageSrc: `${imagePathDefault}img/giraffe.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/giraffe.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'lion',
          translation: 'лев',
          imageSrc: `${imagePathDefault}img/lion.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/lion.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'mouse',
          translation: 'мышь',
          imageSrc: `${imagePathDefault}img/mouse.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/mouse.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'turtle',
          translation: 'черепаха',
          imageSrc: `${imagePathDefault}img/turtle.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/turtle.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'dolphin',
          translation: 'дельфин',
          imageSrc: `${imagePathDefault}img/dolphin.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/dolphin.mp3${audioPathDefaultEnd}`,
        },
      ],
    },
    {
      name: 'Clothes',
      imageSrc: `${imagePathDefault}img/skirt.jpg`,
      cards: [
        {
          word: 'skirt',
          translation: 'юбка',
          imageSrc: `${imagePathDefault}img/skirt.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/skirt.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'pants',
          translation: 'брюки',
          imageSrc: `${imagePathDefault}img/pants.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/pants.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'blouse',
          translation: 'блузка',
          imageSrc: `${imagePathDefault}img/blouse.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/blouse.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'dress',
          translation: 'платье',
          imageSrc: `${imagePathDefault}img/dress.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/dress.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'boot',
          translation: 'ботинок',
          imageSrc: `${imagePathDefault}img/boot.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/boot.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'shirt',
          translation: 'рубашка',
          imageSrc: `${imagePathDefault}img/shirt.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/shirt.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'coat',
          translation: 'пальто',
          imageSrc: `${imagePathDefault}img/coat.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/coat.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'shoe',
          translation: 'туфли',
          imageSrc: `${imagePathDefault}img/shoe.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/shoe.mp3${audioPathDefaultEnd}`,
        },
      ],
    },
    {
      name: 'Emotions',
      imageSrc: `${imagePathDefault}img/sad.jpg`,
      cards: [
        {
          word: 'sad',
          translation: 'грустный',
          imageSrc: `${imagePathDefault}img/sad.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/sad.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'angry',
          translation: 'сердитый',
          imageSrc: `${imagePathDefault}img/angry.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/angry.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'happy',
          translation: 'счастливый',
          imageSrc: `${imagePathDefault}img/happy.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/happy.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'tired',
          translation: 'уставший',
          imageSrc: `${imagePathDefault}img/tired.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/tired.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'surprised',
          translation: 'удивлённый',
          imageSrc: `${imagePathDefault}img/surprised.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/surprised.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'scared',
          translation: 'испуганный',
          imageSrc: `${imagePathDefault}img/scared.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/scared.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'smile',
          translation: 'улыбка',
          imageSrc: `${imagePathDefault}img/smile.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/smile.mp3${audioPathDefaultEnd}`,
        },
        {
          word: 'laugh',
          translation: 'смех',
          imageSrc: `${imagePathDefault}img/laugh.jpg`,
          audioSrc: `${audioPathDefaultStart}audio/laugh.mp3${audioPathDefaultEnd}`,
        },
      ],
    },
    {
      name: 'Vegetables',
      imageSrc: `${imagePathExtended}vegetables/pumpkin.jpg`,
      cards: [
        {
          word: 'pumpkin',
          translation: 'тыква',
          imageSrc: `${imagePathExtended}vegetables/pumpkin.jpg`,
          audioSrc: `${audioPathExtended}pumpkin.mp3`,
        },
        {
          word: 'potato',
          translation: 'картофель',
          imageSrc: `${imagePathExtended}vegetables/potato.jpg`,
          audioSrc: `${audioPathExtended}potato.mp3`,
        },
        {
          word: 'onion',
          translation: 'лук',
          imageSrc: `${imagePathExtended}vegetables/onion.jpg`,
          audioSrc: `${audioPathExtended}onion.mp3`,
        },
        {
          word: 'garlic',
          translation: 'чеснок',
          imageSrc: `${imagePathExtended}vegetables/garlic.jpg`,
          audioSrc: `${audioPathExtended}garlic.mp3`,
        },
        {
          word: 'cucumber',
          translation: 'огурец',
          imageSrc: `${imagePathExtended}vegetables/cucumber.jpg`,
          audioSrc: `${audioPathExtended}cucumber.mp3`,
        },
        {
          word: 'corn',
          translation: 'кукуруза',
          imageSrc: `${imagePathExtended}vegetables/corn.jpg`,
          audioSrc: `${audioPathExtended}corn.mp3`,
        },
        {
          word: 'carrot',
          translation: 'морковь',
          imageSrc: `${imagePathExtended}vegetables/carrot.jpg`,
          audioSrc: `${audioPathExtended}carrot.mp3`,
        },
        {
          word: 'beet',
          translation: 'свекла',
          imageSrc: `${imagePathExtended}vegetables/beet.jpg`,
          audioSrc: `${audioPathExtended}beet.mp3`,
        },
      ],
    },
    {
      name: 'Fruits and Berries',
      imageSrc: `${imagePathExtended}fruits_and_berries/apple.jpg`,
      cards: [
        {
          word: 'apple',
          translation: 'яблоко',
          imageSrc: `${imagePathExtended}fruits_and_berries/apple.jpg`,
          audioSrc: `${audioPathExtended}apple.mp3`,
        },
        {
          word: 'grape',
          translation: 'виноград',
          imageSrc: `${imagePathExtended}fruits_and_berries/grape.jpg`,
          audioSrc: `${audioPathExtended}grape.mp3`,
        },
        {
          word: 'orange',
          translation: 'апельсин',
          imageSrc: `${imagePathExtended}fruits_and_berries/orange.jpg`,
          audioSrc: `${audioPathExtended}orange.mp3`,
        },
        {
          word: 'banana',
          translation: 'банан',
          imageSrc: `${imagePathExtended}fruits_and_berries/banana.jpg`,
          audioSrc: `${audioPathExtended}banana.mp3`,
        },
        {
          word: 'lemon',
          translation: 'лимон',
          imageSrc: `${imagePathExtended}fruits_and_berries/lemon.jpg`,
          audioSrc: `${audioPathExtended}lemon.mp3`,
        },
        {
          word: 'strawberry',
          translation: 'клубника',
          imageSrc: `${imagePathExtended}fruits_and_berries/strawberry.jpg`,
          audioSrc: `${audioPathExtended}strawberry.mp3`,
        },
        {
          word: 'peach',
          translation: 'персик',
          imageSrc: `${imagePathExtended}fruits_and_berries/peach.jpg`,
          audioSrc: `${audioPathExtended}peach.mp3`,
        },
        {
          word: 'raspberry',
          translation: 'малина',
          imageSrc: `${imagePathExtended}fruits_and_berries/raspberry.jpg`,
          audioSrc: `${audioPathExtended}raspberry.mp3`,
        },
      ],
    },
  ],
};

export default cardsBase;
