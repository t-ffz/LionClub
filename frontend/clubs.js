async function loadClubs() {
    try {
        const response = await fetch('http://localhost:3000/clubs');
        const clubs = await response.json();

        const gridContainer = document.getElementById('club-container');
        gridContainer.innerHTML = ''; // clear existing items

        clubs.forEach(club => {
            const item = document.createElement('div');
            item.classList.add('item');
        
            // Flex container for profile pic + name
            const flexContainer = document.createElement('div');
            flexContainer.style.display = 'flex';
            flexContainer.style.alignItems = 'center';
            flexContainer.style.gap = '10px';
        
            // Profile picture with class
            const img = document.createElement('img');
            img.src = club.profile_picture_url || 'https://via.placeholder.com/50';
            img.alt = club.name;
            img.classList.add('profile-pic');  // <-- Add class for CSS targeting
        
            const name = document.createElement('div');
            name.textContent = club.name;
            name.style.cursor = 'pointer';
            name.style.fontWeight = 'bold';
            name.addEventListener('click', () => openModal(club));
        
            flexContainer.appendChild(img);
            flexContainer.appendChild(name);
        
            // Add flex container to item
            item.appendChild(flexContainer);
        
            // Description under flex container
            if (club.description) {
                // Add horizontal line first
                const hr = document.createElement('hr');
                hr.classList.add('item-separator'); // add a class for CSS styling
                item.appendChild(hr);

                const description = document.createElement('div');
                description.textContent = club.description;
                description.classList.add('description'); // keep previous class
                item.appendChild(description);
            }

            // Linktree button (optional)
            if (club.linktree_url) {
                const linktreeBtn = document.createElement('a');
                linktreeBtn.href = club.linktree_url;
                linktreeBtn.target = '_blank';
                linktreeBtn.textContent = "Linktree";
                linktreeBtn.classList.add('linktree-btn');
                item.appendChild(linktreeBtn);
            }

            // Recent Events button (always shown)
            const eventsBtn = document.createElement('a');
            eventsBtn.textContent = "Events/Instagram";
            eventsBtn.classList.add('events-btn'); // use same style as linktree
            eventsBtn.addEventListener('click', () => openModal(club));
            item.appendChild(eventsBtn);




        
            gridContainer.appendChild(item);
        });
        

    } catch (error) {
        console.error('Error loading clubs:', error);
    }
}

loadClubs();


// ----- Modal Logic -----

// Create modal element
const modal = document.createElement('div');
modal.id = 'club-modal';
modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';
modal.style.width = '100%';
modal.style.height = '100%';
modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
modal.style.display = 'none';
modal.style.justifyContent = 'center';
modal.style.alignItems = 'center';
modal.style.zIndex = '1000';
document.body.appendChild(modal);

// Modal content box
const modalContent = document.createElement('div');
modalContent.style.backgroundColor = 'white';
modalContent.style.padding = '20px';
modalContent.style.borderRadius = '10px';
modalContent.style.maxWidth = '800px';
modalContent.style.width = '90%';
modalContent.style.maxHeight = '80%';
modalContent.style.overflowY = 'auto';
modal.appendChild(modalContent);

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalContent.innerHTML = ''; // clear content
    }
});

function openModal(club) {
    modal.style.display = 'flex';
    modalContent.innerHTML = `<h2>${club.name}</h2>`;

    // Instagram post
    if (club.latest_post_url) {
        const blockquote = document.createElement('blockquote');
        blockquote.classList.add('instagram-media');
        blockquote.setAttribute('data-instgrm-permalink', club.latest_post_url);
        blockquote.setAttribute('data-instgrm-version', '14');
        blockquote.style.margin = '20px auto';
        blockquote.style.maxWidth = '540px';
        modalContent.appendChild(blockquote);

        if (!document.getElementById('instagram-embed-script')) {
            const script = document.createElement('script');
            script.async = true;
            script.id = 'instagram-embed-script';
            script.src = "//www.instagram.com/embed.js";
            document.body.appendChild(script);
        } else {
            if (window.instgrm) window.instgrm.Embeds.process();
        }
    }

};


