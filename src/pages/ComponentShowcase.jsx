/**
 * Component Showcase Page
 * Demonstrates all base components and design system
 * This is for development/testing purposes
 */

import { useState } from 'react';
import { Button, Input, Badge, Card, CardHeader, CardBody, CardFooter } from '../components/atoms';

const ComponentShowcase = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            Design System Showcase
          </h1>
          <p className="text-lg text-neutral-600">
            Component library built with Tailwind CSS 4.1 and Atomic Design
          </p>
        </header>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Color Palette</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Primary Colors */}
            <Card padding="lg">
              <h3 className="text-xl font-semibold mb-4">Primary</h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-primary-${shade}`}></div>
                    <span className="text-sm font-mono text-neutral-600">primary-{shade}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Secondary Colors */}
            <Card padding="lg">
              <h3 className="text-xl font-semibold mb-4">Secondary</h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-secondary-${shade}`}></div>
                    <span className="text-sm font-mono text-neutral-600">secondary-{shade}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Semantic Colors */}
            <Card padding="lg">
              <h3 className="text-xl font-semibold mb-4">Semantic</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-success-500"></div>
                  <span className="text-sm font-mono text-neutral-600">success</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-warning-500"></div>
                  <span className="text-sm font-mono text-neutral-600">warning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-error-500"></div>
                  <span className="text-sm font-mono text-neutral-600">error</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Buttons</h2>

          <Card padding="lg">
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-lg font-semibold mb-3">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button loading={loading} onClick={handleLoadingDemo}>
                    {loading ? 'Loading...' : 'Click to load'}
                  </Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-lg font-semibold mb-3">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    rightIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    }
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Inputs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Inputs</h2>

          <Card padding="lg">
            <div className="space-y-6 max-w-2xl">
              {/* Basic Input */}
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                helperText="We'll never share your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              {/* Required Input */}
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                required
              />

              {/* Input with Error */}
              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                error="This username is already taken"
              />

              {/* Input with Icon */}
              <Input
                label="Search"
                type="search"
                placeholder="Search products..."
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />

              {/* Sizes */}
              <div className="space-y-3">
                <Input size="sm" placeholder="Small input" />
                <Input size="md" placeholder="Medium input (default)" />
                <Input size="lg" placeholder="Large input" />
              </div>

              {/* Disabled */}
              <Input
                label="Disabled Input"
                type="text"
                placeholder="This is disabled"
                disabled
                value="Cannot edit this"
              />
            </div>
          </Card>
        </section>

        {/* Badges */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Badges</h2>

          <Card padding="lg">
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>

              {/* With Dot */}
              <div>
                <h3 className="text-lg font-semibold mb-3">With Dot Indicator</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success" dot>In Stock</Badge>
                  <Badge variant="error" dot>Out of Stock</Badge>
                  <Badge variant="warning" dot>Low Stock</Badge>
                </div>
              </div>

              {/* Removable */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Removable</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary" removable onRemove={() => alert('Removed!')}>
                    Electronics
                  </Badge>
                  <Badge variant="secondary" removable onRemove={() => alert('Removed!')}>
                    New Arrival
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Elevated Card */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-2">Elevated Card</h3>
              <p className="text-neutral-600">
                This card has a shadow elevation effect.
              </p>
            </Card>

            {/* Outlined Card */}
            <Card variant="outlined" padding="lg">
              <h3 className="text-xl font-semibold mb-2">Outlined Card</h3>
              <p className="text-neutral-600">
                This card has a border instead of shadow.
              </p>
            </Card>

            {/* Hoverable Card */}
            <Card variant="elevated" padding="lg" hoverable>
              <h3 className="text-xl font-semibold mb-2">Hoverable Card</h3>
              <p className="text-neutral-600">
                Hover over me to see the effect!
              </p>
            </Card>
          </div>

          {/* Card with Sections */}
          <Card variant="elevated" padding="none" className="mt-6">
            <CardHeader className="p-6">
              <h3 className="text-2xl font-bold">Card with Sections</h3>
              <p className="text-neutral-600 mt-1">This card has header, body, and footer</p>
            </CardHeader>
            <CardBody className="p-6">
              <p className="text-neutral-700">
                The card component supports multiple sections for better content organization.
                This is the body section where main content goes.
              </p>
            </CardBody>
            <CardFooter className="p-6 bg-neutral-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Last updated: Today</span>
                <Button size="sm">Learn More</Button>
              </div>
            </CardFooter>
          </Card>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Typography</h2>

          <Card padding="lg">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-neutral-900">Heading 1</h1>
              <h2 className="text-4xl font-bold text-neutral-900">Heading 2</h2>
              <h3 className="text-3xl font-semibold text-neutral-900">Heading 3</h3>
              <h4 className="text-2xl font-semibold text-neutral-900">Heading 4</h4>
              <h5 className="text-xl font-medium text-neutral-900">Heading 5</h5>
              <h6 className="text-lg font-medium text-neutral-900">Heading 6</h6>

              <p className="text-base text-neutral-700 leading-relaxed">
                This is a paragraph with normal text. The quick brown fox jumps over the lazy dog.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <p className="text-sm text-neutral-600">
                This is smaller text, often used for secondary information.
              </p>

              <code className="px-2 py-1 bg-neutral-100 rounded text-sm font-mono text-primary-600">
                const example = "code snippet";
              </code>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-neutral-600 pt-12 border-t border-neutral-200">
          <p>Design System built with Tailwind CSS 4.1 & React 19.2</p>
          <p className="text-sm mt-2">Atomic Design Pattern • Mobile-First • Accessible</p>
        </footer>
      </div>
    </div>
  );
};

export default ComponentShowcase;
