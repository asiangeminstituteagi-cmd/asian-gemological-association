var API_URL = 'https://script.google.com/macros/s/AKfycbxM07GYmFncUSLFNFinKR0NkADw-X0ZfDiZoYwBm27IRjsDWR5OF5VNGkf0ffcMRD7qsg/exec';

function getDriveImageURL(url) {
  if (!url) return '';
  var match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return 'https://drive.google.com/uc?export=view&id=' + match[1];
  }
  return url;
}

function searchCertificate() {
  var reportNo = document.getElementById('reportSearch').value.trim();
  if (!reportNo) {
    alert('Please enter a report number.');
    return;
  }

  var resultDiv = document.getElementById('certResult');
  if (!resultDiv) {
    window.location.href = 'verify.html?id=' + encodeURIComponent(reportNo);
    return;
  }

  resultDiv.innerHTML = '<p style="text-align:center; padding:2rem;">Searching...</p>';

  fetch(API_URL + '?id=' + encodeURIComponent(reportNo))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        resultDiv.innerHTML =
          '<div class="cert-result" style="border-color:#c00;">' +
            '<h2 style="color:#c00;">Certificate Not Found</h2>' +
            '<p>No certificate matches report number: <strong>' + reportNo + '</strong></p>' +
            '<p>Please check the number and try again, or contact us.</p>' +
          '</div>';
        return;
      }

      var img1 = getDriveImageURL(data["Abstract Image"]);
      var img2 = getDriveImageURL(data["Refractometer Image"]);

      var imagesHTML = '';
      if (img1 || img2) {
        imagesHTML = '<div class="cert-images">';
        if (img1) {
          imagesHTML += '<div class="cert-img-wrap"><img src="' + img1 + '" alt="Abstract Image"><p>Abstract Image</p></div>';
        }
        if (img2) {
          imagesHTML += '<div class="cert-img-wrap"><img src="' + img2 + '" alt="Refractometer Image"><p>Refractometer Image</p></div>';
        }
        imagesHTML += '</div>';
      }

      resultDiv.innerHTML =
        '<div class="cert-result">' +
          '<h2>&#10003; Certificate Verified</h2>' +
          '<p style="color:green; margin:0.5rem 0;">This is an authentic AGA certificate.</p>' +
          imagesHTML +
          '<table>' +
            '<tr><td>Report Number</td><td>' + data["Report Number :"] + '</td></tr>' +
            '<tr><td>Species</td><td>' + data["Species:"] + '</td></tr>' +
            '<tr><td>Variety</td><td>' + data["Variety:"] + '</td></tr>' +
            '<tr><td>Weight</td><td>' + data["Weight:"] + '</td></tr>' +
            '<tr><td>Dimensions</td><td>' + data["Dimensions:"] + '</td></tr>' +
            '<tr><td>Cut</td><td>' + data["Cut:"] + '</td></tr>' +
            '<tr><td>Shape</td><td>' + data["Shape:"] + '</td></tr>' +
            '<tr><td>Color Grade</td><td>' + data["Color Grade:"] + '</td></tr>' +
            '<tr><td>Clarity</td><td>' + data["Clarity:"] + '</td></tr>' +
            '<tr><td>Origin</td><td>' + data["Origin:"] + '</td></tr>' +
            '<tr><td>Comment</td><td>' + data["Comment:"] + '</td></tr>' +
          '</table>' +
        '</div>';
    })
    .catch(function() {
      resultDiv.innerHTML =
        '<div class="cert-result" style="border-color:#c00;">' +
          '<h2 style="color:#c00;">Connection Error</h2>' +
          '<p>Unable to reach the verification server. Please try again later.</p>' +
        '</div>';
    });
}

