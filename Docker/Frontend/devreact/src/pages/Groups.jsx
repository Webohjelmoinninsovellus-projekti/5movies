
export default function Groups() {
    return (
<div class="container">

<div class="group-layout">

    <div>
        <div class="group-img">kuva</div>
        <button class="btn-red">Poistu ryhmästä</button>
    </div>


    <div class="group-info">
        <h2>5 MOVIES TESTIRYHMÄ</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. 
            Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris 
            molestie elit, et lacinia ipsum quam nec dui. Quisque nec mauris sit amet elit iaculis pretium sit amet quis magna. 
            Aenean velit odio, elementum in tempus ut, vehicula eu diam.
        </p>

        <h3 class="section-title">Lisätyt elokuvat</h3>
        <div class="card-row">
            <div class="card">kuva</div>
            <div class="card">kuva</div>
            <div class="card">kuva</div>
        </div>

        <h3 class="section-title">Keskustelualue</h3>
        <button class="add-btn">Lisää uusi keskustelu</button>
        <div class="discussion-box"></div>
    </div>


    <div>
        <div class="member-block">
            <h3>Ryhmän omistaja</h3>
            <div class="member">
                <img src="https://via.placeholder.com/60"/>
                <span class="member-name">Rytkön Ville</span>
            </div>
        </div>

        <div class="member-block">
            <h3>Jäsenet</h3>
            <div class="member">
                <img src="https://via.placeholder.com/60"/>
                <span class="member-name">Jari</span>
            </div>
        </div>
    </div>

</div>

</div>
    );
}