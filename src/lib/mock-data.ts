import type { Deck } from './types';

export const SYSTEM_DECKS: Deck[] = [
  {
    id: 'system-1',
    name: '基础解剖学',
    source: 'system',
    createdAt: new Date().toISOString(),
    dailyNewLearned: 0,
    reviewModeToday: false,
    cards: [
      { id: 's1c1', q: '心脏有几个心房？', a: '两个：左心房和右心房。', isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] },
      { id: 's1c2', q: '人体最大的器官是什么？', a: '皮肤。', isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] },
      { id: 's1c3', q: '股骨位于身体的哪个部位？', a: '大腿。', isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] },
    ],
  },
  {
    id: 'system-2',
    name: '药理学核心概念',
    source: 'system',
    createdAt: new Date().toISOString(),
    dailyNewLearned: 0,
    reviewModeToday: false,
    cards: [
      { id: 's2c1', q: '什么是药物的半衰期？', a: '药物在体内的浓度降低一半所需的时间。', isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] },
      { id: 's2c2', q: '阿司匹林的主要作用是什么？', a: '解热、镇痛、抗炎、抗血小板聚集。', isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] },
    ],
  },
];

export const USER_DECKS: Deck[] = [
    {
      id: 'user-1',
      name: '我的第一个卡组',
      source: 'manual',
      createdAt: new Date().toISOString(),
      dailyNewLearned: 0,
      reviewModeToday: false,
      cards: [
        { id: 'u1c1', q: '高血压的诊断标准是什么？', a: '收缩压≥140mmHg和/或舒张压≥90mmHg。', isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] },
        { id: 'u1c2', q: 'II型糖尿病的主要特征是什么？', a: '胰岛素抵抗和相对胰岛素缺乏。', isNew: false, ease: 2.6, intervalDays: 3, repetitions: 1, dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), lastReviewedAt: new Date().toISOString(), history:[] },
        { id: 'u1c3', q: '什么是房颤？', a: '心房颤动，一种常见的心律失常。', isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] },
        { id: 'u1c4', q: '阑尾炎最典型的体征是什么？', a: '麦氏点压痛。', isNew: false, ease: 2.3, intervalDays: 1, repetitions: 2, dueAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), lastReviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), history: [] },
      ],
    },
];
