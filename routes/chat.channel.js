const { Router } = require('express');
const config = require('config');
const Channel = require('../models/Channel.js');
const User = require('../models/User.js');
const router = Router();
const jsonWebToken = require('jsonwebtoken');

//Coming from SetUser
router.get(`/get-users:userId`, verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users, message: 'Users responsed' });
  } catch (e) {
    //console.log('failed in get-users')
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиті ', error: e });
  }
});

router.get(`/get-user`, async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users, message: 'Users responsed' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиті ', error: e });
  }
});

//Coming from AddChannel
router.post('/post-channel:userId', verifyToken, async (req, res) => {
  try {
    const newChannel = await Channel.create(req.body);
    const updatedUserData = await User.findById(req.params.userId);
    console.log('AddChannel ==>> ', updatedUserData);
    updatedUserData.channels.push(newChannel._id);
    await updatedUserData.save();
    console.log('Ended AddChannel ==>> ', updatedUserData);

    //console.log("user with new channel ", updatedUserData)
    res
      .status(201)
      .json({ userData: updatedUserData, message: 'Канал створено' });
  } catch (e) {
    console.log('failed after post channel ', e);
    res.status(500).json({ message: 'Что-то пошло не так -', error: e });
  }
});

console.log('chat.channel файл');

//Coming from AddPeopleToChannel
router.post(
  '/post-add-members-to-channel:activeChannelId',
  verifyToken,
  async (req, res) => {
    try {
      const addedUser = await User.findById(req.body);
      addedUser.channels.push(req.params.activeChannelId);
      await addedUser.save();

      const activeChannel = await Channel.findById(req.params.activeChannelId);
      activeChannel.members.push(req.body);
      await activeChannel.save();

      const updatedChannel = await Channel.findById(req.params.activeChannelId);
      console.log(
        'post-add-members-to-channel:activeChannelId => ',
        updatedChannel
      );

      res.status(201).json({
        userChannels: updatedChannel,
        message: 'Учасника додано',
      });
    } catch (e) {
      console.log('Учасника не додано бо: ', e);
      res.status(500).json({ message: 'Что-то пошло не так -', error: e });
    }
  }
);

//Coming from Channels,
router.post('/get-chunnels', verifyToken, async (req, res) => {
  try {
    let userChannels = [];
    for (const chatId of req.body) {
      const channel = await Channel.find({ _id: chatId });
      userChannels = userChannels.concat(channel);
    }
    //const userChannels = await Channel.find({});
    console.log('getChannels ==>> ', userChannels);
    res.json({ userChannels, message: 'Channels responsed' });
  } catch (e) {
    //console.log('failed in get-messages')
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиті ', error: e });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (token == null) {
    console.log(`помилка при перевірці token`);
    return res.sendStatus(401);
  } else {
    jsonWebToken.verify(token, config.get('jwtSecret'), (err, success) => {
      if (err) {
        console.log(`error in verifyToken ${err}`);
        res.sendStatus(403);
      } else next();
    });
  }
}

module.exports = router;
