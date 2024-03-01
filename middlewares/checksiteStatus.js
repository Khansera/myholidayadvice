const other=require('../db/models/other');

const checkMaintenanceMode =async (req, res, next) => {
  const maintenanceMode= await other.find({});
  const current= new Date();
  const timeline=new Date(maintenanceMode[0].timeline)

  if(timeline<current && maintenanceMode[0].status){
    return res.status(503).send(`<h1>Sorry for the inconvenience, We&rsquo;ll be back soon!, If you need any help to you can always <a href="tel:+91 7889515155">contact us</a></h1> `)
  }
    if (maintenanceMode[0].status) {
        res.status(503).send(`<!doctype html>
        <head>
          <title>Site Maintenance</title>
          <meta charset="utf-8"/>
          <meta name="robots" content="noindex"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { text-align: center; padding: 20px; font: 20px Helvetica, sans-serif; }
            @media (min-width: 768px){
              body{ padding-top: 150px; }
            }
            h1 { font-size: 50px; }
            article { display: block; text-align: left; max-width: 650px; margin: 0 auto; }
            a { color: #dc8100; text-decoration: none; }
            a:hover { color: #efe8e8; text-decoration: none; }
          </style>
        </head>
        <body >
         <div><img src="/images/Picture1.jpg" alt="" style="height: 100px;"></div>
          <article>
              <h1>We&rsquo;ll be back soon!</h1>
              <div>
                  <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. If you need to you can always <a href="mailto:#">contact us</a>, otherwise we&rsquo;ll be back online shortly!</p>
                  <p>&mdash; Expected TimeLine</p>
                  
              </div>
              <div style="display: flex; flex-direction: row; justify-content: space-between;">
                  <strong class="day"></strong>
                  <strong class="hour"></strong>
                  <strong class="minute"></strong>
                  <strong class="second"></strong>
              </div>
          </article>
          <script>
              const countDown = () => {
                  const countDay = new Date('${maintenanceMode[0].timeline}');
                  const now = new Date();
                  const counter = countDay - now;
                  const second = 1000;
                  const minute = second * 60;
                  const hour = minute * 60;
                  const day = hour * 24;
                  const textDay = Math.floor(counter / day);
                  const textHour = Math.floor((counter % day) / hour);
                  const textMinute = Math.floor((counter % hour) / minute);
                  const textSecond = Math.floor((counter % minute) / second)
                  document.querySelector(".day").innerText = textDay + ' Days';
                  document.querySelector(".hour").innerText = textHour + ' Hours';
                  document.querySelector(".minute").innerText = textMinute + ' Minutes';
                  document.querySelector(".second").innerText = textSecond + ' Seconds';
              }
              setInterval(countDown, 1000);
          </script>
        </body>
      </html >`);
    } else {
    next();
}
  };


module.exports = { checkMaintenanceMode }