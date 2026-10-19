import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactReply } from './contactIntent.js';

test('contact and enquiry paraphrases offer only the existing form link', () => {
  for (const text of [
    'Can I fill out an enquiry?', 'can i contact growthway?',
    'hi, i would like to reach out can you help?', 'How do I get in touch?',
    'I have an inquiry', 'How can I reach you?', 'I want to talk to your sales team',
    'Could I speak with a human?', 'Can you call me?', 'What is your phone number?',
    'What is your email address?', 'Can I book a call?', 'I want to request a quote',
  ]) {
    const response = contactReply(text);
    assert.equal(response?.cta, '/contact', text);
    assert.doesNotMatch(response.content, /give me|your name|your email|saved|submitted/i);
  }
});

test('ordinary messages and declined contact produce no contact response', () => {
  for (const text of ['hi', 'What services do you offer?', 'What is this company about?',
    'Can Growthway help my clothing line?', 'What is the investment needed?',
    'How does a project work?', 'Where are you based?', 'What is email marketing?',
    'C-team', 'name: Jane', 'person@example.com', '9876543210', 'confirm',
    "I don't want to contact you", 'Do not call me', 'Cancel enquiry']) {
    assert.equal(contactReply(text), null, text);
  }
});

test('contact intent is evaluated per message without carrying over', () => {
  assert.equal(contactReply('I want to reach out').cta, '/contact');
  assert.equal(contactReply('Thanks'), null);
  assert.equal(contactReply('What services do you offer?'), null);
});

test('project-start requests bypass generation with a contact-form response', () => {
  for (const text of ['How do I start a project?', 'How can we begin a project?',
    'I want to start my project', 'Can we kick off a new project?',
    'How do I get started?', 'How do we get started with Growthway?',
    'I want to work with you', 'Can I hire Growthway?', 'Can we collaborate with your team?']) {
    assert.equal(contactReply(text)?.cta, '/contact', text);
  }
});

test('project process questions and declined starts do not show a button', () => {
  for (const text of ['How does a project work?', 'What are the project stages?',
    'How long does a project take?', 'I am not ready to start a project',
    "I don't want to start a project", 'What services do you offer?']) {
    assert.equal(contactReply(text), null, text);
  }
});
