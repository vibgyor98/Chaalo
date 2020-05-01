const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//filterObject
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) newObj[ele] = obj[ele];
  });
  return newObj;
};

//Handler Function for USERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  res.status(200).json({
    status: 'success',
    results: allUsers.length,
    data: {
      allUsers,
    },
  });
});
exports.createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/devdata/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newUser,
        },
      });
    }
  );
};
exports.getUser = (req, res) => {
  const id = req.params.id * 1;
  const user = users.find((ele) => ele.id === id);
  if (!user) {
    return res.status(404).json({
      status: 'Fail',
      message: 'User Not Found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
exports.updateUser = (req, res) => {
  if (req.params.id * 1 > users.length) {
    res.status(404).json({
      status: 'Fail',
      message: 'User Not Found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated user here..>',
    },
  });
};
exports.deleteUser = (req, res) => {
  if (req.params.id * 1 > users.length) {
    res.status(404).json({
      status: 'Fail',
      message: 'User Not Found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated user here..>',
    },
  });
};

//delete CURRENT USER after Login
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//update CURRENT USERDATA after login
exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, please use /updateMyPassword',
        400
      )
    );
  }
  //update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  //send the updated document
  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});
