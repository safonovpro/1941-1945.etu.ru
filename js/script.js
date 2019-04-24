import '../scss/preload.scss';
import '../scss/style.scss';

import Exposition from './exposition';

const expo = new Exposition('#content');

expo.init()
.then(console.log('Init complited!'));