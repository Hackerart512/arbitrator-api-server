import * as UserService from './user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* --------------------------
  LOGIN
----------------------------*/
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.getUserByEmail(email);

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    console.log("user:-" + user.permissions);

    // Generate JWT token
    const authtoken = jwt.sign(
      {
        userId: user.id,
        role: user.role_name,
        permissions: user.permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ success: true, authtoken, data: user });
  } catch (err) {
    next(err);
  }
};

/* --------------------------
  CRUD (Admin)
----------------------------*/
export const createUser = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const count = await UserService.deleteUser(req.params.id);
    if (count === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
