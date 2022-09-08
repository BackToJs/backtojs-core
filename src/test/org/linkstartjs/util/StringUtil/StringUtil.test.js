var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var $ = process.env.npm_config_local_prefix;
var StringUtil = require($ + '/src/main/org/linkstartjs/util/StringUtil.js');
const cheerio = require('cheerio')

describe('StringUtil: addLsIdToLinkstartTagElements', function() {
    it('simple html', function() {
        var stringUtil = new StringUtil();

        var rawHtml = `
    <table>
      <tbody>
        <tr id="aaa" ls-element=true >
          <td>1</td>
          <td>USA</td>
          <td>1.6</td>
          <td>75.8</td>
          <td>132,000</td>
        </tr>
        <tr id="bbb" ls-element=true >
          <td>2</td>
          <td>INDIA</td>
          <td>12123</td>
          <td>1322</td>
          <td>123213</td>
        </tr>
        <tr id="ccc" ls-element=true >
          <td>3</td>
          <td>BRAZIL</td>
          <td>3123</td>
          <td>213123</td>
          <td>134</td>
        </tr>
        <tr>
         <!-- and more... -->
      </tbody>
    </table>
    `;


        var enhancedHtml = stringUtil.addLsIdToLinkstartTagElements(rawHtml, 5);
        const $ = cheerio.load(enhancedHtml.html, {
            decodeEntities: false,
            scriptingEnabled: true
        });
        expect($('[ls-id=5]').html().includes("USA")).to.equal(true);
        expect($('[ls-id=6]').html().includes("INDIA")).to.equal(true);
        expect($('[ls-id=7]').html().includes("BRAZIL")).to.equal(true);
        expect(enhancedHtml.lastId).to.equal(7);
        expect(enhancedHtml.ids.length).to.equal(3);
        var expectedIds = {
            'aaa': 5,
            'bbb': 6,
            'ccc': 7
        }
        expect(enhancedHtml.ids[0].lsId).to.equal(expectedIds[enhancedHtml.ids[0].htmlObjectId]);
        expect(enhancedHtml.ids[1].lsId).to.equal(expectedIds[enhancedHtml.ids[1].htmlObjectId]);
        expect(enhancedHtml.ids[2].lsId).to.equal(expectedIds[enhancedHtml.ids[2].htmlObjectId]);
    });
    it('simple html cero spaces at the end of tag', function() {
        var stringUtil = new StringUtil();

        var rawHtml = `
    <table>
      <tbody>
        <tr id="aaa" ls-element=true>
          <td>1</td>
          <td>USA</td>
          <td>1.6</td>
          <td>75.8</td>
          <td>132,000</td>
        </tr>
        <tr id="bbb" ls-element=true>
          <td>2</td>
          <td>INDIA</td>
          <td>12123</td>
          <td>1322</td>
          <td>123213</td>
        </tr>
        <tr id="ccc" ls-element=true>
          <td>3</td>
          <td>BRAZIL</td>
          <td>3123</td>
          <td>213123</td>
          <td>134</td>
        </tr>
        <tr>
         <!-- and more... -->
      </tbody>
    </table>
    `;


        var enhancedHtml = stringUtil.addLsIdToLinkstartTagElements(rawHtml, 5);
        const $ = cheerio.load(enhancedHtml.html, {
            decodeEntities: false,
            scriptingEnabled: true
        });
        expect($('[ls-id=5]').html().includes("USA")).to.equal(true);
        expect($('[ls-id=6]').html().includes("INDIA")).to.equal(true);
        expect($('[ls-id=7]').html().includes("BRAZIL")).to.equal(true);
        expect(enhancedHtml.lastId).to.equal(7);
        expect(enhancedHtml.ids.length).to.equal(3);
        var expectedIds = {
            'aaa': 5,
            'bbb': 6,
            'ccc': 7
        }
        expect(enhancedHtml.ids[0].lsId).to.equal(expectedIds[enhancedHtml.ids[0].htmlObjectId]);
        expect(enhancedHtml.ids[1].lsId).to.equal(expectedIds[enhancedHtml.ids[1].htmlObjectId]);
        expect(enhancedHtml.ids[2].lsId).to.equal(expectedIds[enhancedHtml.ids[2].htmlObjectId]);
    });

    it('simple html with more element at the end of tag', function() {
        var stringUtil = new StringUtil();

        var rawHtml = `
      <button id="gotoLoinRedirectButton" ls-element=true  class="aaa bbb" >
    `;


        var enhancedHtml = stringUtil.addLsIdToLinkstartTagElements(rawHtml, 5);
        const $ = cheerio.load(enhancedHtml.html, {
            decodeEntities: false,
            scriptingEnabled: true
        });
        expect($.html().includes('ls-id="5"')).to.equal(true);
        expect(enhancedHtml.lastId).to.equal(5);
        expect(enhancedHtml.ids.length).to.equal(1);
        var expectedIds = {
            'gotoLoinRedirectButton': 5
        }
        expect(enhancedHtml.ids[0].lsId).to.equal(expectedIds[enhancedHtml.ids[0].htmlObjectId]);      
    });    


    it('simple html with more element at the end of tag', function() {
        var stringUtil = new StringUtil();

        var rawHtml = `
      <button ls-element=true id="gotoLoinRedirectButton" type="button" class="btn btn-lg b-0">Continue with Microsoft</
    `;


        var enhancedHtml = stringUtil.addLsIdToLinkstartTagElements(rawHtml, 5);
        const $ = cheerio.load(enhancedHtml.html, {
            decodeEntities: false,
            scriptingEnabled: true
        });
        expect($.html().includes('ls-id="5"')).to.equal(true);
        expect(enhancedHtml.lastId).to.equal(5);
        expect(enhancedHtml.ids.length).to.equal(1);
        var expectedIds = {
            'gotoLoinRedirectButton': 5
        }
        expect(enhancedHtml.ids[0].lsId).to.equal(expectedIds[enhancedHtml.ids[0].htmlObjectId]);      
    });
});