var forms = require("forms"),
    mails = require("mails"),
    sections = require("sections");

Given(/^I'm at Minium Mail/, function() {
  browser.get(config.baseUrl);
  scenario.embed(browser.screenshot().asBytes(), "image/png");
  // we also need to set loading timeout properly
  if (config.loadingTimeSeconds !== undefined || config.useHtml5FileUpload !== undefined) {
    var configureBtn = base.find("#configure");

    configureBtn.click();
    forms.fill({
      "Loading time": config.loadingTimeSeconds || 1,
      "Use HTML5 File Upload": config.useHtml5FileUpload || false
    });
    forms.submit();
  }

  if (config.ramdomData) {
    var generateRandomDataBtn = base.find("#generate-random-data");

    generateRandomDataBtn.click();
    forms.fill({
      "Contacts": config.ramdomData.contacts || 0,
      "Folders": config.ramdomData.folders || 0,
      "Mails": config.ramdomData.mails || 0
    });
    forms.submit();
  }
});

Given(/^an email with (.*?) "(.*?)" exists$/, function(field, value) {
  var filter = {};
  filter[field] = value;

  var mailRow = mails.filter(filter);
  expect(mailRow).to.have.size(1);
  scenario.embed(browser.screenshot().asBytes(), "image/png");
});


Given(/^an email with (.*?) "(.*?)" exists under "(.*?)"$/, function(field, value, section) {
  var filter = {};
  filter[field] = value;

  var mailRow = mails.filter(filter);

  sections.navigate(section);
  expect(mailRow).to.have.size(1);
  scenario.embed(browser.screenshot().asBytes(), "image/png");
});


Given(/^an email with (.*?) "(.*?)" doesn't exist$/, function(field, value) {
  var filter = {};
  filter[field] = value;

  var mailRow = mails.filter(filter);

  expect(mailRow).not.to.exist();
  scenario.embed(browser.screenshot().asBytes(), "image/png");
});


Given(/^an email with (.*?) "(.*?)" doesn't exist under "(.*?)"$/, function(field, value, section) {
  var filter = {};
  filter[field] = value;

  var mailRow = mails.filter(filter);

  sections.navigate(section);
  expect(mailRow).not.to.exist();
});

Given(/^I'm at section "(.*?)"$/, function(section) {
  sections.navigate(section);
});

When(/^I click on button "(.*?)"$/, function(btnLabel) {
  var btn = base.find("button, .button").withText(btnLabel);

  btn.click();
});

When(/^I fill "(.*?)" with "(.*?)"$/, function(field, val) {
  var values = {};
  values[field] = val;

  forms.fill(values);
  scenario.embed(browser.screenshot().asBytes(), "image/png");
});

When(/^I fill:$/, function(datatable) {
  var values = datatable.rowsHash();

  forms.fill(values);
  scenario.embed(browser.screenshot().asBytes(), "image/png");
});

When(/^I click on the email with:$/, function(datatable) {
  var filter = datatable.rowsHash();
  var mailRow = mails.filter(filter);

  mailRow.click();
  scenario.embed(browser.screenshot().asBytes(), "image/png");
});

When(/^I delete an email with Subject "(.*?)"$/, function(subject) {
  mails.remove({ "Subject" : subject });
});

When(/^I move an email with Subject "(.*?)" to "(.*?)"$/, function(subject, section) {
  mails.move({ "Subject" : subject }, section);
});

When(/^I navigate to section "(.*?)"$/, function(section) {
  sections.navigate(section);
  
  // validate the URL of the section
  expect(browser.getCurrentUrl() + "").to.be(config.baseUrl + "#/folders/" + section.toLowerCase());
});

Then(/^I should see an email with:$/, function(datatable) {
  var filter = datatable.rowsHash();
  console.log("Email values: ", JSON.stringify(filter));
  var mailRow = mails.filter(filter);
  expect(mailRow).to.exist();
});

Then(/^I shouldn't see an email with:$/, function(datatable) {
  var filter = datatable.rowsHash();
  var mailRow = mails.filter(filter);
  expect(mailRow).not.to.exist();
});

Then(/^I should see the following emails:$/, function(datatable) {
  var filters = datatable.hashes();
  filters.forEach(function (filter) {
    var mailRow = mails.filter(filter);
    expect(mailRow).to.exist();
    scenario.embed(browser.screenshot().asBytes(), "image/png");
  });
});
