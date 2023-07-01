import type {
  AnnotatedStoryFn,
  Args,
  ArgTypes,
  ArgsFromMeta,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  ProjectAnnotations,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  Parameters,
} from '@storybook/types';
import type { Constructor, OmitIndexSignature, SetOptional, Simplify } from 'type-fest';
import type { FunctionalComponent, VNodeChild } from 'vue';
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers';
import type { LegacyStoryFn as ContextStoryFn } from '@storybook/csf';
import type { VueRenderer, ArgsStoryFn } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs };
export type { VueRenderer, ArgsStoryFn } from './types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TCmpOrArgs = Args> = ComponentAnnotations<
  VueRenderer,
  ComponentPropsOrProps<TCmpOrArgs>
>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TCmpOrArgs = Args> = AnnotatedStoryFn<
  VueRenderer,
  ComponentPropsOrProps<TCmpOrArgs>
>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TMetaOrCmpOrArgs = Args> = TMetaOrCmpOrArgs extends {
  render?: ArgsStoryFn;
  component?: infer TComponent;
  args?: infer DefaultArgs;
}
  ? Simplify<
      ComponentPropsAndSlots<TComponent> & ArgsFromMeta<VueRenderer, TMetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        VueRenderer,
        TArgs,
        SetOptional<TArgs, Extract<keyof TArgs, keyof DefaultArgs>>
      >
    : never
  : StoryAnnotations<VueRenderer, ComponentPropsOrProps<TMetaOrCmpOrArgs>>;

type ExtractSlots<C> = AllowNonFunctionSlots<Partial<OmitIndexSignature<ComponentSlots<C>>>>;

type AllowNonFunctionSlots<Slots> = {
  [K in keyof Slots]: Slots[K] | VNodeChild;
};

export type ComponentPropsAndSlots<C> = ComponentProps<C> & ExtractSlots<C>;

type ComponentPropsOrProps<TCmpOrArgs> = TCmpOrArgs extends Constructor<any>
  ? ComponentPropsAndSlots<TCmpOrArgs>
  : TCmpOrArgs extends FunctionalComponent<any>
  ? ComponentPropsAndSlots<TCmpOrArgs>
  : TCmpOrArgs;

/**
 * @deprecated Use `StoryFn` instead.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories.
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/
 *
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryFn<TArgs>;
export type LegacyStoryFn<TArgs = Args> = ContextStoryFn<VueRenderer, TArgs>;

export type Decorator<TArgs = StrictArgs> = DecoratorFunction<VueRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<VueRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<VueRenderer, TArgs>;
export type Preview = ProjectAnnotations<VueRenderer>;
