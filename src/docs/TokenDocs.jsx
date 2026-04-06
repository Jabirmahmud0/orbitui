function tokenEntries(group, prefix = '') {
  return Object.entries(group).flatMap(([key, token]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (token && typeof token === 'object' && 'value' in token) {
      return [{ name: nextKey, value: token.value }];
    }

    if (token && typeof token === 'object') {
      return tokenEntries(token, nextKey);
    }

    return [];
  });
}

function labelize(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_.]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const surfaceCardStyle = {
  border: '1px solid var(--color-border-default)',
  borderRadius: '1rem',
  background: 'var(--color-background-surface)',
  boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
};

const mutedTextStyle = {
  color: 'var(--color-foreground-muted)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
};

function ColorSwatch({ name, value }) {
  const darkText = [
    '#ffffff',
    '#f8fafc',
    '#eef2ff',
    '#ecfdf3',
    '#eff6ff',
    '#fff7ed',
    '#fffbeb',
    '#fef2f2',
  ].includes(String(value).toLowerCase());

  return (
    <div
      style={{
        ...surfaceCardStyle,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '5rem',
          background: value,
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      />
      <div style={{ padding: '0.875rem 1rem' }}>
        <div
          style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-foreground-primary)' }}
        >
          {labelize(name)}
        </div>
        <div style={{ ...mutedTextStyle, marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
          {name}
        </div>
        <div
          style={{
            marginTop: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.5rem',
            borderRadius: '999px',
            background: darkText ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.85)',
            color: darkText ? 'var(--color-foreground-secondary)' : '#0f172a',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export function ColorScaleSection({ title, description, colors }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{title}</h2>
      <p style={mutedTextStyle}>{description}</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {tokenEntries(colors).map((token) => (
          <ColorSwatch key={token.name} name={token.name} value={token.value} />
        ))}
      </div>
    </section>
  );
}

export function SemanticThemeSection({ title, description, tokensByGroup }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{title}</h2>
      <p style={mutedTextStyle}>{description}</p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {Object.entries(tokensByGroup).map(([groupName, group]) => (
          <div key={groupName} style={{ ...surfaceCardStyle, padding: '1rem 1.125rem' }}>
            <h3 style={{ margin: 0 }}>{labelize(groupName)}</h3>
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.875rem' }}>
              {tokenEntries(group).map((token) => (
                <div
                  key={token.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px minmax(120px, 180px) 1fr',
                    gap: '0.75rem',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--color-foreground-primary)' }}>
                    {labelize(token.name.split('.').at(-1))}
                  </div>
                  <div
                    style={{
                      height: '2.5rem',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--color-border-subtle)',
                      background: token.value,
                    }}
                  />
                  <div style={{ ...mutedTextStyle, fontFamily: 'var(--font-mono)' }}>
                    {token.name}: {token.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MeasureScaleSection({ title, description, items, preview }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{title}</h2>
      <p style={mutedTextStyle}>{description}</p>
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        {Object.entries(items).map(([name, token]) => (
          <div
            key={name}
            style={{
              ...surfaceCardStyle,
              padding: '1rem 1.125rem',
              display: 'grid',
              gridTemplateColumns: '180px 1fr 120px',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{labelize(name)}</div>
              <div style={{ ...mutedTextStyle, fontFamily: 'var(--font-mono)' }}>{token.value}</div>
            </div>
            <div>{preview(token.value)}</div>
            <div style={{ ...mutedTextStyle, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              {name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TypographySection({ title, description, typography }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{title}</h2>
      <p style={mutedTextStyle}>{description}</p>
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        {Object.entries(typography.fontSize).map(([name, token]) => (
          <div
            key={name}
            style={{
              ...surfaceCardStyle,
              padding: '1rem 1.125rem',
              display: 'grid',
              gridTemplateColumns: '120px 1fr 140px',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{labelize(name)}</div>
              <div style={{ ...mutedTextStyle, fontFamily: 'var(--font-mono)' }}>{token.value}</div>
            </div>
            <div
              style={{
                fontSize: token.value,
                lineHeight: 1.2,
                letterSpacing: typography.letterSpacing.tight.value,
                color: 'var(--color-foreground-primary)',
              }}
            >
              OrbitUI builds confident product interfaces.
            </div>
            <div style={{ ...mutedTextStyle, textAlign: 'right' }}>Sans scale</div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {Object.entries(typography.fontFamily).map(([name, token]) => (
          <div key={name} style={{ ...surfaceCardStyle, padding: '1rem 1.125rem' }}>
            <div style={{ fontWeight: 600 }}>{labelize(name)}</div>
            <div
              style={{ ...mutedTextStyle, fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}
            >
              {token.value}
            </div>
            <div
              style={{
                marginTop: '0.875rem',
                fontFamily: token.value,
                fontSize: '1.25rem',
                color: 'var(--color-foreground-primary)',
              }}
            >
              Sphinx of black quartz, judge my vow.
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ShadowSection({ shadows }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Shadows</h2>
      <p style={mutedTextStyle}>
        Elevation tokens are tuned for layered application chrome instead of decorative glow.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {Object.entries(shadows).map(([name, token]) => (
          <div key={name} style={{ ...surfaceCardStyle, padding: '1rem 1.125rem' }}>
            <div style={{ fontWeight: 600 }}>{labelize(name)}</div>
            <div
              style={{
                marginTop: '1rem',
                height: '5rem',
                borderRadius: '1rem',
                background:
                  'linear-gradient(180deg, var(--color-background-page), var(--color-background-subtle))',
                boxShadow: token.value,
                border: '1px solid var(--color-border-subtle)',
              }}
            />
            <div
              style={{ ...mutedTextStyle, fontFamily: 'var(--font-mono)', marginTop: '0.875rem' }}
            >
              {token.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BrandSection({ brands }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Brand Overrides</h2>
      <p style={mutedTextStyle}>
        Brand packs override the primary color ramp and the default sans serif for multi-brand
        deployments.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {Object.entries(brands).map(([name, brand]) => (
          <div key={name} style={{ ...surfaceCardStyle, padding: '1rem 1.125rem' }}>
            <div style={{ fontWeight: 600 }}>{`Brand ${name.toUpperCase()}`}</div>
            <div style={{ ...mutedTextStyle, marginTop: '0.25rem' }}>
              {brand.typography.fontFamily.sans.value}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '0.5rem',
                marginTop: '1rem',
              }}
            >
              {Object.entries(brand.color.primary)
                .slice(0, 6)
                .map(([scale, token]) => (
                  <div key={scale}>
                    <div
                      style={{
                        height: '3rem',
                        borderRadius: '0.75rem',
                        background: token.value,
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    />
                    <div
                      style={{
                        ...mutedTextStyle,
                        marginTop: '0.35rem',
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                      }}
                    >
                      {scale}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
