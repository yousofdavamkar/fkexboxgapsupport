function checkFlexGapSupport() {
  // Create test elements
  const flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.gap = "1px";

  // Append elements to check gap support
  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  // Add to DOM temporarily
  document.body.appendChild(flex);
  
  // Check if gap is working
  const isSupported = flex.scrollHeight === 3; // 1px gap + 2 * 1px elements
  
  // Cleanup
  flex.parentNode.removeChild(flex);
  
  return isSupported;
}

function applyGapFallback() {
  if (!checkFlexGapSupport()) {
    // Select all flex containers with gap
    const flexContainers = document.querySelectorAll('.flex-container');
    
    flexContainers.forEach(container => {
      const gapValue = getComputedStyle(container).gap;
      if (gapValue && gapValue !== 'normal') {
        // Apply negative margin to container
        container.style.margin = `-${gapValue}`;
        
        // Apply margin to all direct children
        Array.from(container.children).forEach(child => {
          child.style.margin = gapValue;
        });
      }
    });
  }
}

// Run on page load
applyGapFallback();
