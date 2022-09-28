function StringUtil() {

    this.addLsIdToLinkstartTagElements = function(rawHtmlString, initialIdCount) {

        /*expected : 

        <a  ls-element=true >
        <a ****** ls-element=true ****** >
        */

        var regexMatches = rawHtmlString.match(new RegExp('<[\\w="-\\s]+\\s+ls-element\\s*=\\s*true\\s*[\\w="-\\s]*\\s*>', "g"));
        var ids = [];

        if(regexMatches==null){
            return;
        }

        for (rawTagFound of regexMatches) {
            //replace ls-element=true by ls-element=true ls-id=N
            var htmlId = getAttributeValue("id", rawTagFound);
            var readyTag = rawTagFound.replace(new RegExp('ls-element\\s*=\\s*true', "g"), `ls-element=true ls-id=${initialIdCount}`);
            rawHtmlString = rawHtmlString.replace(rawTagFound, readyTag);

            if (htmlId != null) {
                ids.push({
                    htmlObjectId: htmlId,
                    lsId: initialIdCount,
                });
            }

            initialIdCount++;
        }
        //get the relation between id and ls-id
        return {
            html: rawHtmlString,
            lastId: initialIdCount - 1,
            ids: ids
        };
    }

    function getAttributeValue(attributeName, rawHtmlLine) {
        try {
            var regexMatches = rawHtmlLine.match(new RegExp(`${attributeName}\\s*=\\s*["']*[\\w]+["']*`, "g"));
            if (regexMatches.length == 0) {
                return;
            }
            if(regexMatches.length==0){
              return;
            }

            return regexMatches[0].split("=")[1].replace(/\"/g,"").trim();
        } catch (err) {
            console.log("html tag has ls-element=true but don't has id=foo . Html: " + rawHtmlLine);
            console.log(err);
        }
    }

}

module.exports = StringUtil