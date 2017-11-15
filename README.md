# react-pyscripts

The goal of react-pyscripts is to provide foundational support for building react components.

It is especially useful for building a component library.

## scoped development

The philosophy behind this is that components should allow for easy development in a stateless manner & then later assembled in a container for their final use in an application, however the former is where the majority of our focus usually lies and so should be performed independently of the application, state and any other concerns that are domain specific.

## devapp

The devapp is a useful script that creates the development application wherein the components can be developed in isolation from the rest of the app. See the [example script for usage details](examples/devapp.sh).

### devapp webpack

The main driver behind the development app is it's custom webpack plugin and configuration setup that allows for an output of targeted individual _microapps_ corresponding to each component.
