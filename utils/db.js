import { get, post, put, del } from './request';

// 获取月视图事件
export async function getEventsByMonth(year, month) {
  const res = await get('/events', { year, month });
  return res.events;
}

// 获取日视图事件
export async function getEventsByDate(date) {
  const res = await get('/events', { date });
  return res.events;
}

// 获取事件详情
export async function getEventDetail(id) {
  const res = await get('/events/' + id);
  return res;
}

// 创建事件
export async function addEvent(event) {
  const res = await post('/events', event);
  return res.event_id;
}

// 更新事件
export async function updateEvent(id, data) {
  await put('/events/' + id, data);
}

// 删除事件
export async function deleteEvent(id) {
  await del('/events/' + id);
}

// 获取用户所有日历
export async function getCalendars() {
  const res = await get('/calendars');
  return res.calendars;
}

// 创建日历
export async function addCalendar(calendar) {
  const res = await post('/calendars', calendar);
  return res.calendar_id;
}

// 更新日历
export async function updateCalendar(id, data) {
  await put('/calendars/' + id, data);
}

// 删除日历
export async function deleteCalendar(id) {
  await del('/calendars/' + id);
}

// 获取日历成员
export async function getCalendarMembers(calendarId) {
  const res = await get('/calendars/' + calendarId + '/members');
  return res.members;
}

// 共享日历
export async function shareCalendar(calendarId, targetUserId, permission) {
  await post('/calendars/' + calendarId + '/share', { targetUserId, permission });
}

// 获取用户信息
export async function getUserInfo() {
  const res = await get('/users/' + getUserId());
  return res;
}

// 搜索用户
export async function searchUsers(keyword) {
  const res = await get('/users/search', { keyword });
  return res.users;
}
