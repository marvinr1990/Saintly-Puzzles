export type LevelCategory = 'saint' | 'christ' | 'mary';

export interface LevelData {
  id: string;
  name: string;
  category: LevelCategory;
  imageUrl: string;
  difficulty: number; // Grid size (e.g., 3 for 3x3)
  winQuote: string;
  /** Short description shown when the puzzle is completed. */
  about: string;
  /** Optional prayer: intercession for saints, Hail Mary for Mary, etc. */
  prayer?: string;
}

const HAIL_MARY =
  'Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.';

export const LEVELS: Record<string, LevelData> = {
  francis: {
    id: 'francis',
    name: 'St. Francis of Assisi',
    category: 'saint',
    imageUrl: '/icons/francis.jpg',
    difficulty: 3,
    winQuote: '"Start by doing what is necessary; then do what is possible; and suddenly you are doing the impossible."',
    about: 'Francis of Assisi (1181–1226) left a life of wealth to live in poverty and preach the Gospel. He founded the Franciscan order and is known for his love of creation, peace, and the poor. His feast is October 4.',
    prayer: 'O Saint Francis, who bore the stigmata and conformed your life to Christ in poverty and charity, pray for us that we may follow the Gospel with joy and care for all creation. Amen.'
  },
  peter: {
    id: 'peter',
    name: 'St. Peter the Apostle',
    category: 'saint',
    imageUrl: '/icons/peter.jpg',
    difficulty: 3,
    winQuote: '"You are the Christ, the Son of the living God."',
    about: 'Simon Peter was a fisherman called by Jesus to be the rock on which the Church is built. He was the first Pope and leader of the Apostles. He was martyred in Rome under Nero. His feast, with St. Paul, is June 29.',
    prayer: 'O Holy Apostle Peter, prince of the Apostles, pray for us that our faith may never fail and that we may feed the flock of Christ with love and fidelity. Amen.'
  },
  paul: {
    id: 'paul',
    name: 'St. Paul the Apostle',
    category: 'saint',
    imageUrl: '/icons/paul.jpg',
    difficulty: 4,
    winQuote: '"I have fought the good fight, I have finished the race, I have kept the faith."',
    about: 'Saul of Tarsus, a persecutor of Christians, was converted on the road to Damascus and became Paul, the Apostle to the Gentiles. His letters form much of the New Testament. His feast, with St. Peter, is June 29.',
    prayer: 'O glorious Saint Paul, Apostle to the Gentiles, pray for us that we may spread the Gospel with zeal and persevere in faith until the end. Amen.'
  },
  mary: {
    id: 'mary',
    name: 'The Virgin Mary',
    category: 'mary',
    imageUrl: '/icons/mary.jpg',
    difficulty: 4,
    winQuote: '"My soul magnifies the Lord, and my spirit rejoices in God my Savior."',
    about: 'The Blessed Virgin Mary is the Mother of God, full of grace, who said yes to the Incarnation. She is our mother in the order of grace and the greatest of the saints.',
    prayer: HAIL_MARY
  },
  guadalupe: {
    id: 'guadalupe',
    name: 'Our Lady of Guadalupe',
    category: 'mary',
    imageUrl: '/icons/guadalupe.jpg',
    difficulty: 5,
    winQuote: '"Am I not here, I who am your Mother?"',
    about: 'In 1531, the Virgin Mary appeared to St. Juan Diego in Mexico, leaving her miraculous image on his tilma. Our Lady of Guadalupe is patroness of the Americas and the unborn. Her feast is December 12.',
    prayer: HAIL_MARY
  },
  john: {
    id: 'john',
    name: 'St. John the Baptist',
    category: 'saint',
    imageUrl: '/icons/john.jpg',
    difficulty: 4,
    winQuote: '"Behold, the Lamb of God, who takes away the sin of the world!"',
    about: 'John the Baptist was the prophet who prepared the way for Christ, baptizing in the Jordan River. He is the son of Zechariah and Elizabeth, and a cousin of Jesus. He was martyred by Herod. His nativity is celebrated June 24.',
    prayer: 'O Saint John the Baptist, voice crying in the wilderness, pray for us that we may repent and make straight the way of the Lord in our hearts. Amen.'
  },
  michael: {
    id: 'michael',
    name: 'St. Michael the Archangel',
    category: 'saint',
    imageUrl: '/icons/michael.jpg',
    difficulty: 4,
    winQuote: '"Who is like God?"',
    about: 'Michael is the archangel who led the heavenly host against Satan and his fallen angels. He is the protector of the Church and patron of soldiers, police, and the sick. His feast is September 29.',
    prayer: 'Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray, and do thou, O Prince of the heavenly hosts, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.'
  },
  joseph: {
    id: 'joseph',
    name: 'St. Joseph',
    category: 'saint',
    imageUrl: '/icons/joseph.jpg',
    difficulty: 4,
    winQuote: '"Go to Joseph."',
    about: 'Saint Joseph, husband of Mary and foster father of Jesus, is the patron of the Church, workers, and a holy death. A just and silent man, he protected the Holy Family and obeyed God without hesitation. He is honored on March 19 and as Patron of the Universal Church.',
    prayer: 'O Saint Joseph, guardian of the Holy Family, pray for us that we may work faithfully, protect those entrusted to us, and die in the peace of Christ. Amen.'
  },
  ignatius: {
    id: 'ignatius',
    name: 'St. Ignatius of Antioch',
    category: 'saint',
    imageUrl: '/icons/ignatius.jpg',
    difficulty: 4,
    winQuote: '"I am the wheat of God, and am ground by the teeth of the wild beasts, that I may be found the pure bread of Christ."',
    about: 'Ignatius of Antioch (c. 35–108) was the third Bishop of Antioch and a student of the Apostle John. He wrote seven letters to the early churches while being led to Rome for martyrdom. He is one of the Apostolic Fathers and a witness to the real presence of Christ in the Eucharist. His feast is October 17.',
    prayer: 'O Saint Ignatius of Antioch, glorious martyr and bishop, pray for us that we may hold fast to the true Faith, love the Eucharist, and be united with Christ even unto death. Amen.'
  },
  thomas: {
    id: 'thomas',
    name: 'St. Thomas Aquinas',
    category: 'saint',
    imageUrl: '/icons/thomas.jpg',
    difficulty: 4,
    winQuote: '"To one who has faith, no explanation is necessary. To one without faith, no explanation is possible."',
    about: 'Thomas Aquinas (1225–1274) was a Dominican friar, philosopher, and theologian. His Summa Theologiae remains one of the greatest works of Catholic thought. Known as the Angelic Doctor, he harmonized faith and reason. His feast is January 28.',
    prayer: 'O Angelic Doctor, Saint Thomas Aquinas, pray for us that we may grow in wisdom and knowledge of the truth, and love God with all our mind and heart. Amen.'
  },
  jesus: {
    id: 'jesus',
    name: 'Jesus Christ (Pantocrator)',
    category: 'christ',
    imageUrl: '/icons/jesus.jpg',
    difficulty: 5,
    winQuote: '"I am the way, and the truth, and the life."',
    about: 'Jesus Christ is the Son of God, the Word made flesh, who died and rose for our salvation. The Pantocrator ("Ruler of All") icon shows Him as Lord and Judge of the world.'
  }
};

/** Ordered level ids for display: saints first, then Mary, then Christ. */
export const LEVEL_ORDER: string[] = [
  'francis', 'peter', 'paul', 'michael', 'john', 'ignatius', 'joseph', 'thomas',
  'mary', 'guadalupe',
  'jesus'
];
