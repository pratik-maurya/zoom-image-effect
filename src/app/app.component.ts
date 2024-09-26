import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'zoom-image-effect';
  zoomImageUrl: string | null = null;
  zoomPaneVisible = false;
  image_url='../assets/nike-shoes-for-men.jpeg'
  onMouseMove(event: MouseEvent, imageUrl: string, imageElement: any) {
    console.log('Mouse moved over image:', imageUrl);

    this.zoomImageUrl = imageUrl;
    this.zoomPaneVisible = true;

    const zoomPane = document.querySelector('.zoom-pane') as HTMLElement;
    const target = event.currentTarget as HTMLImageElement; // Cast to HTMLImageElement

    const { offsetX, offsetY } = event;
    const x = (offsetX / target.clientWidth) * 100;
    const y = (offsetY / target.clientHeight) * 100;

    zoomPane.style.backgroundImage = `url(${imageUrl})`;
    zoomPane.style.backgroundSize = '245% 245%';
    zoomPane.style.backgroundPosition = `${x}% ${y}%`;

    // Position the zoom pane to the right of the image
    const rect = target.getBoundingClientRect();
    zoomPane.style.left = `${rect.right + 10}px`; // Adjust positioning as needed
    zoomPane.style.top = `${rect.top + window.scrollY}px`;

    // Get the container of the image element
    const imageContainer = imageElement.parentElement as HTMLElement;
    const containerRect = imageContainer.getBoundingClientRect(); // Get container dimensions

    // Reuse or create the bounding box
    let boundingBox = imageElement['boundingBox'] as HTMLElement;

    if (!boundingBox) {
        // Create the bounding box if it doesn't exist
        boundingBox = document.createElement('div');
        boundingBox.className = 'hover-bounding-box';
        boundingBox.style.position = 'absolute';
        boundingBox.style.width = '256px'; // Adjust the width as necessary
        boundingBox.style.height = '150px'; // Adjust the height as necessary
        boundingBox.style.backgroundColor = "rgba(210, 215, 211, 0.5)";
        boundingBox.style.border = '1px solid rgba(0, 0, 0, 0.3)';
        boundingBox.style.pointerEvents = 'none'; // Prevent interference with mouse events
        boundingBox.style.zIndex = '1000';

        // Ensure the container is positioned relative
        imageContainer.style.position = 'relative';
        // document.body.appendChild(boundingBox);


        // Append the bounding box to the image's container
        imageContainer.appendChild(boundingBox);

        // Store the bounding box in the image element for reuse
        imageElement['boundingBox'] = boundingBox;
    }

    // Ensure the bounding box is visible
    boundingBox.style.display = 'block';

    // Update the bounding box position relative to the container
    const containerX = event.clientX - containerRect.left;
    const containerY = event.clientY - containerRect.top;

    // Center the bounding box around the cursor
    const boxWidth = boundingBox.offsetWidth;
    const boxHeight = boundingBox.offsetHeight;

    boundingBox.style.left = `${containerX - boxWidth / 2}px`;
    boundingBox.style.top = `${containerY - boxHeight / 2}px`;

    // Clamp the bounding box to stay within the container
    if (containerX - boxWidth / 2 < 0) {
        boundingBox.style.left = '0px';
    }
    if (containerX + boxWidth / 2 > containerRect.width) {
        boundingBox.style.left = `${containerRect.width - boxWidth}px`;
    }
    if (containerY - boxHeight / 2 < 0) {
        boundingBox.style.top = '0px';
    }
    if (containerY + boxHeight / 2 > containerRect.height) {
        boundingBox.style.top = `${containerRect.height - boxHeight}px`;
    }
}

onMouseLeave(imageElement: any) {
  this.zoomPaneVisible = false;
    // Hide the bounding box when the mouse leaves the image
    const boundingBox = imageElement['boundingBox'] as HTMLElement;
    if (boundingBox) {
        // boundingBox.style.display = 'none'; // Hide the bounding box
        boundingBox.remove(); // Remove the bounding box from the DOM
        delete imageElement['boundingBox']; // Clean up the reference
    }
}
}
