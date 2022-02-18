const fadeIn = {
  name: "FadeIn",
  variants: {
    initial: {
      opacity: 0,
      transition: {
        duration: 0.7
      }
    },
    animate: {
      opacity: 1
    },
    exit: {
      transition: {
        duration: 1
      }
    }
  }
};

const fadeFront = {
  name: "fadeFront",
  variants: {
    initial: {
      opacity: 0,
      scale: 1.3
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    exit: {
      opacity: 0,
      scale: 1.3
    }
  },
  transition: {
    ease: 'easeInOut'
  }
}

export const animations = {
  fadeIn,
  fadeFront
};